const Post = require('../models/Post');
const User = require('../models/User');

// --- Create a new post ---
exports.createPost = async (req, res) => {
  const { textContent, imageUrl } = req.body;

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      textContent,
      imageUrl,
      author: req.user.id,
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Get all posts for the feed ---
exports.getAllPosts = async (req, res) => {
  try {
    // Find all posts, sort by most recent, and populate author/commenter info
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', ['username', 'profilePicture']) // Get author's username and picture
      .populate('comments.user', ['username', 'profilePicture']); // Get commenter's username and picture

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Like or Unlike a post ---
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.toString() === req.user.id)) {
      // If yes, unlike it
      post.likes = post.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // If no, like it
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Comment on a post ---
exports.commentOnPost = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ msg: 'Comment text is required' });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            user: req.user.id,
            text: text,
        };

        post.comments.unshift(newComment); // Add to the beginning of the array

        await post.save();
        
        // Populate the new comment with user info before sending back
        const populatedPost = await Post.findById(req.params.id)
            .populate('comments.user', ['username', 'profilePicture']);

        res.json(populatedPost.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
