const express = require('express');
const router = express.Router();
const { followUser, getPublicUserProfile } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   PUT api/users/follow/:id
// @desc    Follow or unfollow a user
// @access  Private
router.put('/follow/:id', authMiddleware, followUser);

// @route   GET api/users/:id
// @desc    Get a user's public profile
// @access  Private (user must be logged in to view profiles)
router.get('/:id', authMiddleware, getPublicUserProfile);

module.exports = router;

