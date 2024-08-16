const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to handle registration and login
router.post('/login', authController.loginOrRegister);

module.exports = router;
