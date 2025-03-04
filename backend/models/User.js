const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    solanaWallet: {
      type: String,
      trim: true,
      default: ''
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
