const Message = require('../models/Message');
const User = require('../models/User');
const Profile = require('../models/Profile');
const ChatRecord = require('../models/ChatRecord');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, content, replyTo } = req.body;

    // Check if user is trying to send a message to themselves
    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({ message: 'You cannot send messages to yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      subject,
      content,
      replyTo: replyTo || null
    });

    // Update recipient's profile stats (increment chatsReceived and earnings)
    if (recipient.profile) {
      const recipientProfile = await Profile.findById(recipient.profile);
      if (recipientProfile) {
        // Increment chats received
        recipientProfile.chatsReceived += 1;
        
        // TODO: Add earnings functionality later
        // // Add chat price to earnings
        // if (recipientProfile.chatPrice > 0) {
        //   recipientProfile.earnings += recipientProfile.chatPrice;
        // }
        
        // Always set earnings to 0 for now
        recipientProfile.earnings = 0;
        
        // Update current week's chats
        recipientProfile.currentWeekChats += 1;
        
        // Every Sunday (or when day of week is 0), update the weekly stats
        const dayOfWeek = new Date().getDay();
        if (dayOfWeek === 0) {
          recipientProfile.previousWeekChats = recipientProfile.currentWeekChats;
          recipientProfile.currentWeekChats = 0;
        }
        
        await recipientProfile.save();
        
        // Create or update a ChatRecord for today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day
        
        // Find existing chat record for today
        let chatRecord = await ChatRecord.findOne({
          profile: recipientProfile._id,
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
          }
        });
        
        if (chatRecord) {
          // Increment existing record
          chatRecord.count += 1;
          await chatRecord.save();
          console.log(`Updated chat record for ${today.toISOString().split('T')[0]}: ${chatRecord.count}`);
        } else {
          // Create new record
          chatRecord = await ChatRecord.create({
            profile: recipientProfile._id,
            date: today,
            count: 1
          });
          console.log(`Created new chat record for ${today.toISOString().split('T')[0]}: 1`);
        }
      }
    }

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username')
      .populate('recipient', 'username');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inbox messages (messages received by the user)
// @route   GET /api/messages/inbox
// @access  Private
const getInboxMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .populate('sender', 'username')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent messages (messages sent by the user)
// @route   GET /api/messages/sent
// @access  Private
const getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate('recipient', 'username')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single message by ID
// @route   GET /api/messages/:id
// @access  Private
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .populate('replyTo');

    // Check if message exists
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is authorized to view this message
    if (
      message.sender._id.toString() !== req.user._id.toString() &&
      message.recipient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }

    // If user is recipient and message is unread, mark as read
    if (
      message.recipient._id.toString() === req.user._id.toString() &&
      !message.isRead
    ) {
      message.isRead = true;
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    // Check if message exists
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only the recipient can delete a message
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the recipient can decline/delete a message' });
    }

    await Message.deleteOne({ _id: message._id });
    res.json({ message: 'Message declined' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  getMessageById,
  deleteMessage,
  getUnreadCount
};
