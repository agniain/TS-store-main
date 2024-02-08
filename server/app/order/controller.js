const { defineAbilityFor } = require("../../middlewares");
const Product = require("../product/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("./model");
const OrderDetail = require("./orderDetailModel");

const clearUserCart = async (userId) => {
  try {
      
    // Find cart items
    const userCartItems = await CartItem.find({ user: userId });

    // Delete each cart item
    for (const cartItem of userCartItems) {
      await CartItem.deleteOne({ _id: cartItem._id });
    }

    console.log(`User's cart cleared successfully`);
  } catch (error) {
    console.error('Error clearing user cart:', error.message);
    throw error;
  }
};

  const createOrderDetails = async (cartItemIds, orderId, userId) => {
    const orderDetails = [];
  
    // Fetch cart items with populated products including product price
    const cartItems = await CartItem.find({ _id: { $in: cartItemIds } }).populate({
      path: 'products.productId',
      select: '_id price',
    });
  
    for (const cartItem of cartItems) {
      const products = cartItem.products.map(product => ({
        productId: product.productId._id,
        quantity: product.quantity,
        price: product.productId.price,
      }));
  
      const orderDetail = await OrderDetail.create({
        user: userId,
        products: products,
        sub_total: cartItem.sub_total,
        delivery_fee: cartItem.delivery_fee,
        total_order: cartItem.total_order,
        order_id: orderId,
      });
  
      orderDetails.push({
        products: orderDetail.products.map(product => ({
          productId: {
            _id: product.productId._id,
            price: product.price,
          },
          quantity: product.quantity,
        })),
        sub_total: orderDetail.sub_total,
        delivery_fee: orderDetail.delivery_fee,
        total_order: orderDetail.total_order,
        order_id: orderDetail.order_id,
        _id: orderDetail._id,
      });
    }
  
    return orderDetails;
  };



const store = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 1, message: 'User not authenticated' });
    }
    const payload = req.body;
    console.log('Received Order Data:', payload);

    if (payload.cart_items && payload.cart_items.length > 0) {
      let items = await CartItem.find({ _id: { $in: payload.cart_items } });

      if (items.length > 0) {
        payload.cart_items = items.map((cartItem) => cartItem._id);
      } else {
        delete payload.cart_items;
      }
    }

    if (payload.delivery_address && payload.delivery_address.length > 0) {
      let address = await DeliveryAddress.find({ _id: { $in: payload.delivery_address } });

      if (address.length > 0) {
        payload.delivery_address = address.map((address) => address._id);
      } else {
        delete payload.delivery_address;
      }
    }

    // Create a new order
    let newOrder = new Order(payload);

    // Check permissions
    let policy = defineAbilityFor(req.user);
    if (!policy.can('create', 'Order')) {
      return res.json({
        error: 1,
        message: `You're not allowed to create orders.`,
      });
    }

    // Save order
    await newOrder.save();

    // Create order details
    const orderDetails = await createOrderDetails(payload.cart_items, newOrder._id, req.user._id);

    // Update order 
    newOrder.order_details = orderDetails;

    // update order_details
    await newOrder.save();
    console.log('Order ID:', newOrder._id);   

    const populatedOrder = await Order.findById(newOrder._id).populate('order_details');
    
    console.log('Order created', populatedOrder);

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder,
    });

    // Clear cart    
    await clearUserCart(req.user._id);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    const order = await Order
      .findOne({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate({
        path: 'user',
        select: 'full_name',
      })
      .populate('delivery_address')
      .populate({
        path: 'order_details',
        populate: {
          path: 'products.productId', 
          model: 'Product',
        },
      });

    if (!order) {
      return res.status(404).json({
        error: 1,
        message: `Order not found for the user`,
      });
    }

    // Check user permissions
    const policy = defineAbilityFor(req.user);
    if (!policy.can('read', 'Order')) {
      return res.status(403).json({
        error: 1,
        message: `Invoice is not allowed to be shown.`,
      });
    }

    // Map order details to the desired format
    const formattedOrderDetails = order.order_details.map(orderDetail => ({
      products: orderDetail.products.map(product => ({
        name: product.productId.name, 
        price: product.price,
        quantity: product.quantity,
      })),
      sub_total: orderDetail.sub_total,
      delivery_fee: orderDetail.delivery_fee,
      total_order: orderDetail.total_order,
    }));

    const responseData = {
      user: order.user && order.user.full_name,
      delivery_address: order.delivery_address,
      order_details: formattedOrderDetails,
      status: order.status
    };

    return res.json({
      data: responseData,
    });

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = {
    store,
    show
}