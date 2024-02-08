const Product = require('../product/model');
const Category = require('./model');
const Categories = require('./model');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        const category = new Categories(payload);
        await category.save()
        return res.json(category);

    } catch (error) {
        throw error
    }
};

const update = async (req, res, next) => {
    try{
        const payload = req.body;
        const { id } = req.params;
        const category = await Categories.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        res.json(category)
    } catch (error) {
        throw error
    }
}

const index = async (req, res, next) => {
    try {
        const category = await Categories.find();
        return res.json(category);
        
    }   catch (error) {
        throw error
    }
};

const getProductsByCategory = async (req, res, next) => {
    try {
        const { name } = req.params;

        const category = await Category.findOne({ name });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const products = await Product.find({ category: { $in: [category._id] } })
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
        let category = await Categories.findByIdAndDelete(req.params.id);
        return res.json(category);
    }   catch (error) {
        throw error
    }
}

module.exports = {
    store,
    index,
    getProductsByCategory,
    update,
    destroy,
}