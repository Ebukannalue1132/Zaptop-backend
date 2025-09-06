// Validation middleware for request data
exports.validateSignup = (req, res, next) => {
  const { fullName, email, password } = req.body;
  
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full name, email, and password'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }
  
  next();
};

exports.validatePayment = (req, res, next) => {
  const { amount, senderName } = req.body;
  
  if (!amount || !senderName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide amount and sender name'
    });
  }
  
  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0'
    });
  }
  
  next();
};