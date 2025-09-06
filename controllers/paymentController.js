const Payment = require('../models/Payment');
const User = require('../models/User');

// Record a new payment
exports.recordPayment = async (req, res) => {
  try {
    const { amount, senderName, paymentMethod } = req.body;
    
    // Generate unique reference
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      amount,
      senderName,
      paymentMethod,
      reference
    });
    
    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully. Waiting for verification.',
      data: {
        payment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get user payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: {
        payments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get all payments (for admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'fullName email accountNumber').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: {
        payments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Verify payment (for admin)
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }
    
    payment.status = 'verified';
    payment.verifiedAt = new Date();
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Credit user account (for admin)
exports.creditAccount = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId).populate('userId');
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.status !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be verified first'
      });
    }
    
    // Update user balance
    const user = await User.findById(payment.userId._id);
    user.balance += payment.amount;
    await user.save();
    
    // Update payment status
    payment.status = 'credited';
    payment.creditedAt = new Date();
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: `Account credited successfully with ₦${payment.amount}`,
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          accountNumber: user.accountNumber,
          newBalance: user.balance
        },
        payment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};