const db = require("../models");
const ProductOleholeh = db.productOleholeh;

// CREATE DATA
exports.create = async (req, res) => {
    
    let fileImages = []
    const dataFiles = req.files
    const checkDataFiles = Array.isArray(dataFiles) && dataFiles.length

    // CHECK UPLOAD IMAGE
    if (!checkDataFiles) {
        res.status(400).send({
            message: "You must upload images"
        })
        return
    }

    // INPUT URL PATH IMAGE TO ARRAY
    dataFiles.forEach((v, i) => {
        fileImages.push(`${v.path}`)
    });

    // VALIDATION DATA INPUT
    if (!req.body.title ||
        !req.body.store_id ||
        !req.body.store_name) {
        res.status(400).json({
            success: false,
            message: "Title, Store_id, and Store_name can not be empty",
            data: {}
        })
        return
    }

    // SAVE DATA
    ProductOleholeh.create({
        title: req.body.title,
        description: req.body.description,
        store: {
            id: req.body.store_id,
            name: req.body.store_name
        },
        categories: [{category: req.body.category}],
        assets: {
            images: fileImages,
            videos: req.body.videos
        },
        shipping: {
            demension: {
                heigth: req.body.heigth,
                length: req.body.length,
                width: req.body.width
            },
            weigth: req.body.weigth
        },
        reguler_price: req.body.reguler_price,
        sales: {
            price: req.body.sales_price,
            start_date: req.body.sales_start_date,
            end_date: req.body.sales_end_date
        },
        stock_qty: req.body.stock_qty,
        status: "tersedia",
        deleted: false
    })
        .then(data => {
            console.log(data)
            const dataArray = [data]
            let newData = dataArray.map(item => {
            return {
                "title": item.title,
                "description": item.description,
                "store": {
                    "id": item.store.id,
                    "name": item.store.name,
                },
                "categories": {
                    "id": item.categories.id,
                    "category": item.categories
                },
                'assets': {
                    "images": item.assets.images,
                    "videos": item.assets.videos
                },
                "shipping": {
                    "demension": {
                        "heigth": item.shipping.demension.heigth,
                        "length": item.shipping.demension.length,
                        "width": item.shipping.demension.width
                    },
                    "weigth": item.shipping.weigth
                },
                "reguler_price": item.reguler_price,
                "sales": {
                    "price": item.sales.price,
                    "start_date": item.sales.start_date,
                    "end_date": item.sales.end_date
                },
                "stock_qty": item.stock_qty,
                "status": item.status
            }
        })
            res.status(201).send({
                success: true,
                message: "data created",
                data: newData
            })
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message,
                data: {}
            })
        })
}


// GET ALL DATA
exports.findAll = async (req, res, next) => {

        const currentPage = req.query.page || 1
        const perPage = req.query.perPage || 5
        let totalData;
        let previousPage = 0;
        let nextPage = 0;

    try {

        totalData = await ProductOleholeh.find({ deleted: false })
        .countDocuments()
        
        const data = await ProductOleholeh.find({ deleted: false }).populate('category_oleholeh')
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))

        const maxPage = totalData / parseInt(perPage);
        const minPage = 1;

        // previous page
        if(currentPage > minPage)
        {
            previousPage = parseInt(currentPage) - 1;
        }else
        {
            previousPage = null
        }

        // next page
        if(currentPage < maxPage)
        {
            nextPage = parseInt(currentPage) + 1;
        }else 
        {
            nextPage = null;
        }

        

        let dataFind = data.map(item => {
            return {
                "title": item.title,
                "description": item.description,
                "store": {
                    "id": item.store.id,
                    "name": item.store.name,
                },
                "categories": {
                    "id": item.categories[0].id,
                    "category": item.categories[0].category
                },
                'assets': {
                    "images": item.assets.images,
                    "videos": item.assets.videos
                },
                "shipping": {
                    "demension": {
                        "heigth": item.shipping.demension.heigth,
                        "length": item.shipping.demension.length,
                        "width": item.shipping.demension.width
                    },
                    "weigth": item.shipping.weigth
                },
                "reguler_price": item.reguler_price,
                "sales": {
                    "price": item.sales.price,
                    "start_date": item.sales.start_date,
                    "end_date": item.sales.end_date
                },
                "stock_qty": item.stock_qty,
                "status": item.status
            }
        })

        res.status(200).send({
            status: true,
            message: "data found",
            data: dataFind,
            total_data: totalData,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage),
            previous_page: previousPage,
            next_page: nextPage 
        })


    }catch (error) {
        res.status(500).send({
            status: false,
            message: error.message,
            data: {}
        })
    }
};

// GET DETAIL DATA
exports.findOne = async (req, res) => {
    const slug = req.params.slug
    try {
        const data = await ProductOleholeh.findOne({ slug: slug, deleted: false })
        if (!data) {
            res.status(404).send({
                status: false,
                message: "Data not found",
                data: {}
            })
            return
        }

        const dataArray = [data]
        let dataFind = dataArray.map(item => {
            return {
                "title": item.title,
                "description": item.description,
                "store": {
                    "id": item.store.id,
                    "name": item.store.name,
                },
                "categories": {
                    "id": item.categories.id,
                    "category": item.categories.category
                },
                'assets': {
                    "images": item.assets.images,
                    "videos": item.assets.videos
                },
                "shipping": {
                    "demension": {
                        "heigth": item.shipping.demension.heigth,
                        "length": item.shipping.demension.length,
                        "width": item.shipping.demension.width
                    },
                    "weigth": item.shipping.weigth
                },
                "reguler_price": item.reguler_price,
                "sales": {
                    "price": item.sales.price,
                    "start_date": item.sales.start_date,
                    "end_date": item.sales.end_date
                },
                "stock_qty": item.stock_qty,
                "status": item.status
            }
        })


        res.status(200).send({
            status: true,
            message: "data found",
            data: dataFind
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

// UPDATE DATA
exports.update = async (req, res) => {

    const slugInputParams = req.params.slug
    let fileImages = []
    const dataUpdate = req.body

    const dataFiles = req.files
    const checkDataFiles = Array.isArray(dataFiles) && dataFiles.length

    if (!checkDataFiles) {
        res.status(400).send({
            message: "You must upload images"
        })
        return
    }

    dataFiles.forEach((v, i) => {
        fileImages.push(`${v.path}`)
    });


    // VALIDATION DATA INPUT
    if (!req.body.title ||
        !req.body.store_id ||
        !req.body.store_name) {
        res.status(400).json({
            success: false,
            message: "Title, Store_id, and Store_name can not be empty",
            data: {}
        })
        return
    }

    dataUpdate.images = fileImages

    ProductOleholeh.findOneAndUpdate({ slug: slugInputParams }, {
        $set: {
            title: req.body.title,
            store: {
                id: req.body.store_id,
                name: req.body.store_name
            },
            description: req.body.description,
            assets: {
                images: fileImages,
                videos: req.body.videos
            },
            shipping: {
                demension: {
                    heigth: req.body.heigth,
                    length: req.body.length,
                    width: req.body.width
                },
                weigth: req.body.weigth
            },
            reguler_price: req.body.reguler_price,
            sales: {
                price: req.body.sales_price,
                start_date: req.body.sales_start_date,
                end_date: req.body.sales_end_date
            },
            stock_qty: req.body.stock_qty,
            status: req.body.status,
            deleted: (!req.body.status || req.body.status === "tidak tersedia") ? true : false
        }
    }, { useFindAndModify: false })
        .then(data => {

            if (!data) {
                res.status(404).json({
                    success: false,
                    message: "Slug Not Found",
                    data: {}
                })
                return
            }

        const dataArray = [data]
        let dataAfterUpdate = dataArray.map(item => {
            return {
                "title": item.title,
                "description": item.description,
                "store": {
                    "id": item.store.id,
                    "name": item.store.name,
                },
                "categories": {
                    "id": item.categories.id,
                    "category": item.categories.category
                },
                'assets': {
                    "images": item.assets.images,
                    "videos": item.assets.videos
                },
                "shipping": {
                    "demension": {
                        "heigth": item.shipping.demension.heigth,
                        "length": item.shipping.demension.length,
                        "width": item.shipping.demension.width
                    },
                    "weigth": item.shipping.weigth
                },
                "reguler_price": item.reguler_price,
                "sales": {
                    "price": item.sales.price,
                    "start_date": item.sales.start_date,
                    "end_date": item.sales.end_date
                },
                "stock_qty": item.stock_qty,
                "status": item.status
            }
        })

            res.status(200).json({
                success: true,
                message: "Success Modify Data",
                data: dataAfterUpdate
            })

        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err,
                data: {}
            })
        })
}

// DELETE DATA
exports.remove = async (req, res) => {
    const slug = req.params.slug
    try {
        const data = await ProductOleholeh.findOne({ slug: slug, deleted: false });

        if (!data || data.deleted === true) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
                data: {}
            });
        }

        data.deleted = true;
        data.status = "tidak tersedia"
        await data.save();
        res.status(200).json({
            success: true,
            message: "Product Deleted",
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
}
