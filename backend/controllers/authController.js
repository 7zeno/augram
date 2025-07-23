const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register User ---
exports.registerUser = async (req, res) => {
  const { rollNumber, username, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ rollNumber });
    if (user) {
      return res.status(400).json({ msg: 'User with this roll number already exists' });
    }

    // 2. Create a new user instance
    user = new User({
      rollNumber,
      username,
      password
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save the user to the database
    await user.save();

    // 5. Create and return a JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Login User ---
exports.loginUser = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ rollNumber });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Create and return a JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// --- Get Logged-in User's Profile ---
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id is attached by the authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
