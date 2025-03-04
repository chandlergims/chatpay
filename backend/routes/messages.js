const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  getMessageById,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');

// Routes
router.post('/', protect, sendMessage);
router.get('/inbox', protect, getInboxMessages);
router.get('/sent', protect, getSentMessages);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:id', protect, getMessageById);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
