const mongoose = require('mongoose');
const Product = require('../product/model');

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantity: {
            type: Number,
            required: true,
            min: 0
        }
        }
    ],

    sub_total: Number,

    delivery_fee: {
      type: Number,
      default: 30000
    }, 

    total_order: Number, 
}, { timestamps: true });

cartItemSchema.pre('save', async function (next) {
  try {
    // Calculate sub_total
    this.sub_total = 0;
    for (const product of this.products) {
      const productDetails = await Product.findById(product.productId);
      this.sub_total += productDetails.price * product.quantity;
    }

    // Calculate total_order
    this.total_order = this.sub_total + this.delivery_fee;

    next();
  } catch (error) {
    next(error);
  }
});


const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
