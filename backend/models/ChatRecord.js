const mongoose = require('mongoose');

const ChatRecordSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    count: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index on profile and date for efficient queries
ChatRecordSchema.index({ profile: 1, date: 1 });

module.exports = mongoose.model('ChatRecord', ChatRecordSchema);
