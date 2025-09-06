const express = require('express');
const { 
  recordPayment, 
  getPaymentHistory, 
  getAllPayments, 
  verifyPayment, 
  creditAccount 
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');

const router = express.Router();

// User routes
router.use(protect);
router.post('/', validatePayment, recordPayment);
router.get('/history', getPaymentHistory);

// Admin routes
router.use(admin);
router.get('/all', getAllPayments);
router.patch('/verify/:paymentId', verifyPayment);
router.patch('/credit/:paymentId', creditAccount);

module.exports = router;