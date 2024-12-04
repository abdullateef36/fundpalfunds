const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://akinolaabdulateef36:BsoJVJv7qCQMLSF4@cluster0.4i1we.mongodb.net/fundpal")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ensure the uploads folder exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Schema and Model
const FundSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  fundTitle: String,
  category: String,
  description: String,
  goal: Number,
  donationMethod: String,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
});

const Fund = mongoose.model('Fund', FundSchema);

// Routes
// Create a fund with an image
app.post('/funds', upload.single('profileImage'), async (req, res) => {
  try {
    const { file, body } = req;
    const profileImage = file ? `http://localhost:5000/uploads/${file.filename}` : null;

    const newFund = new Fund({ ...body, profileImage });
    await newFund.save();

    res.status(201).json({ message: 'Fund created successfully', fund: newFund });
  } catch (err) {
    res.status(500).json({ message: 'Error creating fund', error: err.message });
  }
});

// Get all funds
app.get('/funds', async (req, res) => {
  try {
    const funds = await Fund.find();
    res.status(200).json(funds);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching funds', error: err.message });
  }
});

// Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
