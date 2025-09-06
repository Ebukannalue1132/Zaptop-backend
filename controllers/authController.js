const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// User registration
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      phone
    });
    
    // Remove password from output
    newUser.password = undefined;
    
    // Create token
    const token = signToken(newUser._id);
    
    res.status(201).json({
      success: true,
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }
    
    // Remove password from output
    user.password = undefined;
    
    // Create token
    const token = signToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
