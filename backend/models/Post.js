const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We define the Comment schema separately to allow for recursion
const CommentSchema = new Schema({
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
  },
  // This is the key change: replies will be an array of Comment schemas
  replies: [this] 
});


// Define the Post Schema
const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  textContent: {
    type: String,
    required: [true, 'Post text content is required'],
    trim: true,
    maxlength: 2000
  },
  imageUrl: {
    type: String,
    default: ''
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // The comments array will now use the new CommentSchema
  comments: [CommentSchema]
}, {
  timestamps: true
});

// Create and export the Post model
module.exports = mongoose.model('Post', PostSchema);
