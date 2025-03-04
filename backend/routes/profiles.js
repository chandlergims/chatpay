const express = require('express');
const router = express.Router();
const {
  createProfile,
  getMyProfile,
  getProfiles,
  getProfileByUserId,
  getProfileChatRecords
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Create or update profile (protected route)
router.post('/', protect, createProfile);

// Get current user profile (protected route)
router.get('/me', protect, getMyProfile);

// Get all profiles (public route)
router.get('/', getProfiles);

// Get profile by user ID (public route)
router.get('/user/:userId', getProfileByUserId);

// Get chat records for a profile (public route)
router.get('/:profileId/chat-records', getProfileChatRecords);

module.exports = router;
