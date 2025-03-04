const Profile = require('../models/Profile');
const User = require('../models/User');
const ChatRecord = require('../models/ChatRecord');

// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      avatar,
      chatPrice
    } = req.body;

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        {
          name,
          bio: bio || profile.bio,
          avatar: avatar || profile.avatar,
          chatPrice: chatPrice !== undefined ? chatPrice : profile.chatPrice
        },
        { new: true }
      );

      return res.json(profile);
    }

    // Create new profile
    profile = new Profile({
      user: req.user._id,
      name,
      bio: bio || '',
      avatar: avatar || '',
      chatPrice: chatPrice || 0
    });

    await profile.save();
    
    // Update user with profile reference
    await User.findByIdAndUpdate(
      req.user._id,
      { profile: profile._id },
      { new: true }
    );
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profiles with pagination and search
// @route   GET /api/profiles
// @access  Public
const getProfiles = async (req, res) => {
  try {
    const { search, filter, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'user.username': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Determine sort order based on filter
    let sortOptions = { createdAt: -1 }; // Default sort by most recent
    
    // Add filter if provided
    if (filter && filter !== 'all') {
      if (filter === 'online') {
        query.isActive = true;
      } else if (filter === 'earnings') {
        sortOptions = { earnings: -1 }; // Sort by earnings (highest first)
      } else if (filter === 'chatsReceived') {
        sortOptions = { chatsReceived: -1 }; // Sort by chats received (highest first)
      }
    }
    
    // Get profiles with pagination
    const profiles = await Profile.find(query)
      .populate('user', 'username twitter')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Profile.countDocuments(query);
    
    res.json({
      profiles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profiles/user/:userId
// @access  Public
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'username twitter');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat records for a profile
// @route   GET /api/profiles/:profileId/chat-records
// @access  Public
const getProfileChatRecords = async (req, res) => {
  try {
    const { profileId } = req.params;
    
    // Get the last 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today
    
    // Find chat records for the last 7 days
    const chatRecords = await ChatRecord.find({
      profile: profileId,
      date: {
        $gte: sevenDaysAgo,
        $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) // End of today
      }
    }).sort({ date: 1 });
    
    // Create an array of the last 7 days
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        count: 0
      });
    }
    
    // Fill in the counts from the chat records
    chatRecords.forEach(record => {
      const dateString = record.date.toISOString().split('T')[0];
      const dayIndex = days.findIndex(day => day.date === dateString);
      if (dayIndex !== -1) {
        days[dayIndex].count = record.count;
      }
    });
    
    res.json(days);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  getProfiles,
  getProfileByUserId,
  getProfileChatRecords
};
