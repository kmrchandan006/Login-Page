const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like index.html and style.css)
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect('mongodb+srv://kmrchandan006:chandan%40123@cluster0.dqtnskf.mongodb.net/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema for storing usernames and passwords
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// User model
const User = mongoose.model('User', userSchema);

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Password validation function
function validatePassword(password) {
  const regex = /^[A-Z]/; // Password must start with a capital letter
  return regex.test(password);
}

// Handle registration and login submission
app.post('/login', async (req, res) => {
  const { loginUser, password } = req.body;

  // Validate the password
  if (!validatePassword(password)) {
    return res.send('Password must start with a capital letter.');
  }

  try {
    // Check if the user already exists
    const foundUser = await User.findOne({ username: loginUser });

    if (foundUser) {
      // If user exists, check if the password matches
      if (foundUser.password === password) {
        res.send('Login successful!');
      } else {
        res.send('Invalid password.');
      }
    } else {
      // If user does not exist, create a new user with the provided credentials
      const newUser = new User({ username: loginUser, password: password });
      await newUser.save();
      res.send('Registration successful! You can now log in.');
    }
  } catch (err) {
    res.send('Error connecting to the database.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
