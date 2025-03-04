const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: 50
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    chatPrice: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000
    },
    isActive: {
      type: Boolean,
      default: true
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0
    },
    chatsReceived: {
      type: Number,
      default: 0,
      min: 0
    },
    // Track daily chat counts for the last 7 days
    dailyChats: {
      type: Object,
      default: function() {
        // Initialize with the last 7 days with 0 chats
        const dailyChats = {};
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
          dailyChats[dateString] = 0;
        }
        
        console.log('Initializing dailyChats:', dailyChats);
        return dailyChats;
      }
    },
    // Track previous week's chats for growth calculation
    previousWeekChats: {
      type: Number,
      default: 0
    },
    // Track current week's chats for growth calculation
    currentWeekChats: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);
