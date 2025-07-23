const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post Schema
const PostSchema = new Schema({
  // The author of the post, linked to the User model
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates a reference to a User document
    required: true
  },
  // The text content of the post
  textContent: {
    type: String,
    required: [true, 'Post text content is required'],
    trim: true,
    maxlength: 2000
  },
  // Optional URL for an image associated with the post
  imageUrl: {
    type: String,
    default: ''
  },
  // An array of User IDs who have liked the post
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // An array of comment objects
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  // Automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true
});

// Create and export the Post model
module.exports = mongoose.model('Post', PostSchema);
