const { defineAbilityFor } = require("../../middlewares");
const DeliveryAddress = require("./model");

const store = async (req, res, next) => {
    console.log('Entered store function');
    try {
        console.log('User in address:', req.user);
        let payload = req.body;
        let user = req.user;

        let address = new DeliveryAddress({...payload, user: user._id});
        let policy = defineAbilityFor(req.user);
        console.log('Permissions:', policy.rules);
        if(!policy.can('create', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to modify.`
            });
        }
        await address.save();
        console.log('address created')
        return res.json(address);

    }   catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        // Check if the delivery address exists
        const address = await DeliveryAddress.findById(id);
        if (!address) {
            return res.status(404).json({
                error: 1,
                message: `Delivery address not found!`,
            });
        }

        // Check user permissions
        const policy = defineAbilityFor(req.user);
        if (!policy.can('update', 'DeliveryAddress')) {
            return res.status(403).json({
                error: 1,
                message: `You're not allowed to modify this delivery address!`
            });
        }

        // Update
        const updatedAddress = await DeliveryAddress.findByIdAndUpdate(id, payload, { new: true });

        if (!updatedAddress) {
            return res.status(500).json({
                error: 1,
                message: `Failed to update the delivery address`,
            });
        }

        console.log('Address updated:', updatedAddress);
        res.json(updatedAddress);
    } catch (error) {
        console.error('Error updating delivery address:', error);
        res.status(500).json({
            error: 1,
            message: 'Internal server error',
        });
    }
};

module.exports = { update };



const index = async (req, res, next) => {
    try {
        console.log("user ID for address:", req.user._id);
        const address = await DeliveryAddress.findOne({ user: req.user._id })

        if (!address) {
            return res.json({
                error: 1,
                message: "Address not found for the user"
            });
        }

        // check user permissions
        let policy = defineAbilityFor(req.user);
        if (!policy.can('read', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: "You're not allowed to read the address"
            });
        }

        return res.json(address);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        let { id } = req.params;
        let address = await DeliveryAddress.findById(id);

        let policy = defineAbilityFor(req.user);
        if(!policy.can('delete', 'DeliveryAddress')) {
            return res.json({
                error: 1,
                message: `You're not allowed to delete.`
            });
        }
        
        address = await DeliveryAddress.findByIdAndDelete(id);
        console.log('address deleted')
        return res.json(address);
    }   catch (error) {
        throw error
    }
}

module.exports = {
    store,
    index,
    update,
    destroy,
}