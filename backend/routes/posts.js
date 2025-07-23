const express = require('express'); // FIX: Changed 'onst' to 'const'
const router = express.Router();
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  replyToComment // New function import
} = require('../controllers/postsController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authMiddleware, createPost);

// @route   GET api/posts
// @desc    Get all posts for the homepage feed
// @access  Private
router.get('/', authMiddleware, getAllPosts);

// @route   PUT api/posts/like/:id
// @desc    Like or unlike a post
// @access  Private
router.put('/like/:id', authMiddleware, likePost);

// @route   POST api/posts/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', authMiddleware, commentOnPost);

// @route   POST api/posts/comment/:postId/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post('/comment/:postId/:commentId/reply', authMiddleware, replyToComment);


module.exports = router;