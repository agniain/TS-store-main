const Product = require('../product/model');
const Tags = require('./model');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        const tag = new Tags(payload);
        await tag.save()
        return res.json(tag);

    } catch (error) {
        throw error
    }
};

const update = async (req, res, next) => {
    try{
        const payload = req.body;
        const { id } = req.params;
        const tag = await Tags.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        res.json(tag)
    } catch (error) {
        throw error
    }
}

const index = async (req, res, next) => {
    try {
        const tag = await Tags.find();
        return res.json(tag);
        
    }   catch (error) {
        throw error
    }
};

const getProductsByTagId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tag = await Tags.findById(id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        const products = await Product.find({ tags: { $in: [tag._id] } })
            .populate('category')
            .populate('tags');

        res.json(products);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        let tag = await Tags.findByIdAndDelete(req.params.id);
        return res.json(tag);
    }   catch (error) {
        throw error
    }
}

module.exports = {
    store,
    index,
    getProductsByTagId,
    update,
    destroy,
}