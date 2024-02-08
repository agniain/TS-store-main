const { defineAbilityFor } = require("../../middlewares");
const Order = require("../order/model");

const show = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order
      .findOne({ _id: orderId, user: req.user._id })
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
    if (!policy.can('read', 'Invoice')) {
      return res.status(403).json({
        error: 1,
        message: `Invoice is not allowed to be shown.`,
      });
    }

    // Map order details 
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
      created_at: order.createdAt,
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
  show,
};