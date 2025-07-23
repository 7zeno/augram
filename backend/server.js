// Import required packages
require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize the Express app
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());
// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => console.error('MongoDB Connection Error:', err));

// --- API Routes ---
// When a request comes to /api/auth, use the routes defined in './routes/auth'
app.use('/api/auth', require('./routes/auth'));
// When a request comes to /api/posts, use the routes defined in './routes/posts'
app.use('/api/posts', require('./routes/posts'));
// When a request comes to /api/users, use the routes defined in './routes/users'
app.use('/api/users', require('./routes/users'));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000; // Use the port from environment variables or default to 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

