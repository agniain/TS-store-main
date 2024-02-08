const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  sub_total: {
    type: Number,
    required: true,
  },

  delivery_fee: {
    type: Number,
    required: true,
  },

  total_order: {
    type: Number,
    required: true,
  },

  order_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
}, { timestamps: true, strictPopulate: false });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail;