const { defineAbilityFor } = require("../../middlewares");
const CartItem = require("../cart-item/model");
const Product = require("../product/model");

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;

        if (payload.products && payload.products.length > 0) {
            const productIds = payload.products.map(product => product.productId);
            let productInCart = await Product.find({ _id: { $in: productIds } });

            if (productInCart.length > 0) {
                payload.products = productInCart.map(product => ({
                    productId: product._id,
                    quantity: payload.products.find(p => p.productId.toString() === product._id.toString()).quantity
                }));
            } else {
                delete payload.products;
            }
        }

        const existingCart = await CartItem.findOne({ user: req.user._id });

        if (existingCart) {
            // Cart exists, update it
            let policy = defineAbilityFor(req.user);
            if (!policy.can('update', 'CartItem')) {
                return res.json({
                    error: 1,
                    message: `You're not allowed to update the cart!`
                });
            }

            // Update
            if (payload.products && payload.products.length > 0) {
                for (const newProduct of payload.products) {
                    const existingProductIndex = existingCart.products.findIndex(
                        p => p.productId.toString() === newProduct.productId.toString()
                    );

                    if (newProduct.quantity === 0) {
                        // If the quantity is 0, remove the product from the cart
                        if (existingProductIndex !== -1) {
                            const removedProduct = existingCart.products.splice(existingProductIndex, 1)[0];

                            // Increase product stock
                            const product = await Product.findById(removedProduct.productId);
                            product.stock += removedProduct.quantity;
                            await product.save();
                        }
                    } else {
                        // If the quantity is greater than 0, update the existing quantity or add a new product
                        if (existingProductIndex !== -1) {
                            // Product already exists, update quantity
                            existingCart.products[existingProductIndex].quantity += newProduct.quantity;

                            // Decrease or increase product stock based on the quantity difference
                            const product = await Product.findById(newProduct.productId);
                            const quantityDifference = newProduct.quantity - existingCart.products[existingProductIndex].quantity;
                            product.stock -= quantityDifference;
                            await product.save();
                        } else {
                            // Product not exist, add it to the cart
                            existingCart.products.push(newProduct);

                            // Decrease product stock
                            const product = await Product.findById(newProduct.productId);
                            product.stock -= newProduct.quantity;
                            await product.save();
                        }
                    }
                }
            }


            // Remove products with quantity 0
            console.log('Before filtering:', existingCart.products);
            existingCart.products = existingCart.products.filter(product => product.quantity > 0);
            console.log('After filtering:', existingCart.products);
            await existingCart.save();

            return res.json({ message: 'Cart updated successfully', cart: existingCart });
        } else {
            // Cart doesn't exist, create it
            let createCart = new CartItem({ ...payload, user: user._id });

            let policy = defineAbilityFor(req.user);
            if (!policy.can('create', 'CartItem')) {
                return res.json({
                    error: 1,
                    message: `You're not allowed to create a cart!`
                });
            }

            // Update product stock for each item in the cart
            if (payload.products && payload.products.length > 0) {
                for (const newProduct of payload.products) {
                    const product = await Product.findById(newProduct.productId);
                    product.stock -= newProduct.quantity;
                    await product.save();
                }
            }

            await createCart.save();
            return res.json({ message: 'Cart created successfully', cart: createCart });
        }
    } catch (error) {
        next(error);
    }
};

const view = async(req, res, next) => {
    try {
        let carts = 
        await CartItem
        .findOne({ user: req.user._id })
        .populate({
          path: 'products.productId', 
          model: 'Product',
        });

        let policy = defineAbilityFor(req.user);
            if (!policy.can('read', 'CartItem')) {
                return res.json({
                    error: 1,
                    message: `You're not allowed to read a cart!`
                });
            }
        console.log(carts)
        return res.json(carts);

    }   catch (err) {
        if(err && err.name == 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err)
    }
}

module.exports = {
    store,
    view
}