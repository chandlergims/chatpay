const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password, twitter, solanaWallet } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      password,
      twitter: twitter || '',
      solanaWallet: solanaWallet || '',
      profile: null // Initialize profile as null
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        twitter: user.twitter,
        solanaWallet: user.solanaWallet,
        isAdmin: user.isAdmin,
        profile: user.profile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        twitter: user.twitter,
        solanaWallet: user.solanaWallet,
        isAdmin: user.isAdmin,
        profile: user.profile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        twitter: user.twitter,
        solanaWallet: user.solanaWallet,
        isAdmin: user.isAdmin,
        profile: user.profile,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
