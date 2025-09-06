const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  accountNumber: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate account number before saving
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.accountNumber) {
    // Generate 10-digit random account number
    let accountNumber;
    let isUnique = false;
    
    while (!isUnique) {
      accountNumber = Math.random().toString().substr(2, 10);
      const existingUser = await mongoose.model('User').findOne({ accountNumber });
      if (!existingUser) isUnique = true;
    }
    
    this.accountNumber = accountNumber;
  }
  
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  next();
});

// Check password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);