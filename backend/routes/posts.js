onst express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  replyToComment // New function import
} = require('../controllers/postsController');
const authMiddleware = require('../middleware/authMiddleware');

// ... (other routes remain the same) ...

// @route   POST api/posts/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', authMiddleware, commentOnPost);

// @route   POST api/posts/comment/:postId/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post('/comment/:postId/:commentId/reply', authMiddleware, replyToComment);


module.exports = router;