const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);