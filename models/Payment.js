const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'credited'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'bank_transfer'
  },
  reference: {
    type: String,
    unique: true
  },
  adminNote: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: Date,
  creditedAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
