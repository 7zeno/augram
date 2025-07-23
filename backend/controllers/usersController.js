const User = require('../models/User');

// --- Follow / Unfollow a User ---
exports.followUser = async (req, res) => {
    // Ensure user is not trying to follow themselves
    if (req.user.id === req.params.id) {
        return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if already following
        if (currentUser.following.some(follow => follow.toString() === req.params.id)) {
            // --- Unfollow logic ---
            currentUser.following = currentUser.following.filter(
                follow => follow.toString() !== req.params.id
            );
            userToFollow.followers = userToFollow.followers.filter(
                follower => follower.toString() !== req.user.id
            );
        } else {
            // --- Follow logic ---
            currentUser.following.push(req.params.id);
            userToFollow.followers.push(req.user.id);
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({ msg: 'User follow status updated', following: currentUser.following });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get a user's public profile ---
exports.getPublicUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password') // Don't send back the password
            .populate('followers', ['username', 'profilePicture']) // Populate followers with details
            .populate('following', ['username', 'profilePicture']); // Populate following with details

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // You can also add post details here if you want
        // const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });

        res.json({ user /*, posts */ });

    } catch (err) {
        console.error(err.message);
        // Handle cases where the ID is not a valid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

