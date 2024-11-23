const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://akinolaabdulateef36:BsoJVJv7qCQMLSF4@cluster0.4i1we.mongodb.net/fundpal")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
// Create a fund
app.post('/funds', async (req, res) => {
  try {
    const newFund = new Fund(req.body);
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
