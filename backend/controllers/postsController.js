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
      .populate('author', ['username', 'profilePicture'])
      .populate({
          path: 'comments',
          populate: {
              path: 'user replies.user', // Populate user in comments and their replies
              select: 'username profilePicture'
          }
      });

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
            replies: []
        };

        post.comments.unshift(newComment); // Add to the beginning of the array

        await post.save();
        
        const populatedPost = await Post.findById(req.params.id)
            .populate('comments.user', ['username', 'profilePicture']);

        res.json(populatedPost.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// --- Reply to a Comment ---
exports.replyToComment = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ msg: 'Reply text is required' });
    }

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Helper function to find a comment by its ID recursively
        const findComment = (comments, commentId) => {
            for (const comment of comments) {
                if (comment._id.toString() === commentId) {
                    return comment;
                }
                if (comment.replies && comment.replies.length > 0) {
                    const foundInReply = findComment(comment.replies, commentId);
                    if (foundInReply) {
                        return foundInReply;
                    }
                }
            }
            return null;
        };

        const comment = findComment(post.comments, req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const newReply = {
            user: req.user.id,
            text: text,
            replies: [] // Initialize replies array for the new reply
        };

        comment.replies.unshift(newReply); // Add to the beginning of the replies array

        await post.save();
        
        // Populate user details before sending back the full post
        const populatedPost = await Post.findById(req.params.postId)
            .populate('author', ['username', 'profilePicture'])
            .populate({
                path: 'comments',
                populate: {
                    path: 'user replies.user', // Populate user in comments and their replies
                    select: 'username profilePicture'
                }
            });

        res.json(populatedPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};