const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./User');
const Category = require('./Category');

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());

// INCREASE LIMIT FOR IMAGE UPLOADS (Crucial for Base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- MONGODB CONNECTION ---
// Replace <password> with your actual password (remove the < > brackets)
const MONGO_URI = "mongodb+srv://vinodh0512_db_user:gSq2gYcaeAAUojPh@demoapp.lutu98s.mongodb.net/"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- ROUTES ---

// 1. Root Route (For testing in browser)
app.get('/', (req, res) => {
  res.send('Backend is Running! 🚀');
});

// 2. SIGNUP
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// 3. LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. GET ALL CATEGORIES
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ADD NEW CATEGORY (With Image)
app.post('/categories', async (req, res) => {
  const { name, icon, bg } = req.body;

  if (!name || !icon) {
    return res.status(400).json({ message: "Name and Icon are required" });
  }

  try {
    const newCategory = new Category({ name, icon, bg });
    await newCategory.save();
    res.json({ message: 'Category added successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});