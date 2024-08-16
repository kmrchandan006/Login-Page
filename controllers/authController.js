const bcrypt = require('bcryptjs');
const User = require('../models/User');

const validatePassword = (password) => {
  const regex = /^[A-Z]/; // Password must start with a capital letter
  return regex.test(password) && password.length == 6;
};

exports.loginOrRegister = async (req, res) => {
  const { loginUser, password } = req.body;

  if (!validatePassword(password)) {
    return res.send('Password must start with a capital letter and be at least 6 characters long.');
  }

  try {
    const foundUser = await User.findOne({ username: loginUser });

    if (foundUser) {
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (isMatch) {
        return res.send('Login successful!');
      } else {
        return res.send('Invalid password.');
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username: loginUser, password: hashedPassword });
      await newUser.save();
      return res.send('Registration successful! You can now log in.');
    }
  } catch (err) {
    return res.send('Error connecting to the database.');
  }
};
