const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup } = require('../middleware/validation');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', login);

module.exports = router;
