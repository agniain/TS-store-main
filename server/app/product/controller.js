const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');


const store = async (req, res, next) => {
    try{
        let payload = req.body;

        if(payload.category){
            let category = 
                await Category
                .findOne({name: {$regex: payload.category, $options: 'i'}});
            if(category){
                payload = {...payload, category: category._id};
            } else {
             delete payload.category;
            }
        }

        if(payload.tags && payload.tags.length > 0){
            let tags = 
                await Tag
                .find({name: {$in: payload.tags}});
            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)};
            } else {
             delete payload.tags;
            }
        }

        if(req.file){
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {

                    let product = new Product({ ...payload, image_url: filename })
                    await product.save()
                    console.log(product);
                    return res.json(product);

                } catch(err){
                    fs.unlinkSync(target_path);
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async(err) => {
                next(err);
            });

        } else{

            let product = new Product(payload);
            await product.save();
            console.log(product);
            return res.json(product);

        }
    } catch(err) {
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

const index = async (req, res, next) => {
    try {
        let { page = 1, limit = 12, q = '', category = '', tags = '' } = req.query;
        
        let skip = (page - 1) * limit;
        let criteria = {};

        if(q.length) {
            criteria = {
                ...criteria,
                name: {$regex: `${q}`, $options: 'i'}
            };
        }

        if(category.length){
            let categoryResult = await Category.findOne({name: {$regex: `${category}`}, $options: 'i'});
            
            if(categoryResult) {
                criteria = {...criteria, category: categoryResult._id}
            }
        }

        if(tags.length){
            let tagsResult = await Tag.find({name: {$in: tags}});
            if (tagsResult.length > 0) {
                criteria = {...criteria, tags: {$in: tagsResult.map(tag => tag._id)}}
            }
        }

        let count = await Product.find(criteria).countDocuments();

        let product = await Product
        .find(criteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('category')
        .populate('tags');

        // Set Cache-Control header to 'no-store'
        res.setHeader('Cache-Control', 'no-store');

        return res.json({
            data: product,
            count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
        });
        
    } catch (err) {
        console.error(err);
        next(err);
    }
}


const view = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category tags');
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const update = async (req, res, next) => {
    try{
        let payload = req.body;
        let { id } = req.params;

        if(payload.category){
            let category = 
                await Category
                .findOne({name: {$regex: payload.category, $options: 'i'}});
            if(category){
                payload = {...payload, category: category._id};
            } else {
             delete payload.category;
            }
        }
        
        if(payload.tags && payload.tags.length > 0){
            let tags = 
                await Tag
                .find({_id: {$in: payload.tags}});
            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)};
            } else {
             delete payload.tags;
            }
        }

        if(req.file){
            console.log(req.file);
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = await Product.findById(id);
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
                    
                    if(fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    product = await Product.findByIdAndUpdate(id, payload, {
                        new: true,
                        runValidators: true
                    });
                    return res.json(product);

                } catch(err){
                    fs.unlinkSync(target_path);
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }

                    next(err);
                }
            });

            src.on('error', async(err) => {
                next(err);
            });

        } else{

            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
            return res.json(product);

        }
    } catch(err) {
        console.error(err);
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

const destroy = async (req, res, next) => {
    try {
        let { id } = req.params;
        let product = await Product.findByIdAndDelete(id);
        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        
        if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }

        res.json(product);

    }   catch(err) {

        throw err;
    }
}

module.exports = {
    store,
    index,
    view,
    update,
    destroy,
}