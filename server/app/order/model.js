const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  order_details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderDetail',
    },
  ],

  delivery_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryAddress',
  },

  status: {
    type: String,
    enum: ['menunggu pembayaran', 'diproses', 'di perjalanan', 'diantar'],
    default: 'menunggu pembayaran',
  },

}, { timestamps: true });  

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;