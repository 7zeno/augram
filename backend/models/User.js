const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User Schema
const UserSchema = new Schema({
  // Roll number must be a string, is required, and must be unique
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true // Removes whitespace from both ends of a string
  },
  // Username for display purposes
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  // Password will be hashed before saving
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  // URL to the user's profile picture
  profilePicture: {
    type: String,
    default: '' // Default to an empty string if no picture is provided
  },
  // A short bio for the user's profile
  bio: {
    type: String,
    default: '',
    maxlength: 150
  },
  // Array of User IDs who follow this user
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User' // This creates a reference to another User document
  }],
  // Array of User IDs this user is following
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  // Automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true
});

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
