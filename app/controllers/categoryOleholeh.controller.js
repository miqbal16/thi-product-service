const db = require('../models');
const CategoryOleholeh = db.categoryOleholeh;
const slug = require("slugify")


// GET ALL DATA
exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1
    const perPage = req.query.perPage || 5
    let totalData;

    try {

        totalData = await CategoryOleholeh.find()
        .countDocuments()

        const data = await CategoryOleholeh.find().select({
            "__v": 0
        })
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))

        let dataFind = data.map(item => {
            return {
                "id": item._id,
                "category": item.category,
                "description": item.description,
                "slug": item.slug,
                "createdAt": item.createdAt,
                "updatedAt": item.updatedAt
            }
        })

        res.status(200).send({
            success: true,
            message: "data found",
            data: dataFind,
            total_data: totalData,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            data: {}
        })
    }
}

// CREATE DATA
exports.create = async (req, res) => {

    // INPUT DATA
    const category = req.body.category
    const slug_data = slug(category, {lower: true});
    const description = req.body.description

    if (!category || !description) {
        res.status(400).send({
            success: false,
            message: "category or description can't be empty",
            data: {}
        })
        return
    }

    try {
        const data = await CategoryOleholeh.create({
            category: category,
            slug: slug_data,
            description: description
        })

        const dataArray = [data]
        let newData = dataArray.map(item => {
            return {
                "id": item._id,
                "category": item.category,
                "description": item.description,
                "slug": item.slug,
                "createdAt": item.createdAt,
                "updatedAt": item.updatedAt
            }
        })

        res.status(200).send({
            success: true,
            message: "data has been create",
            data: newData
        })

    }catch(error) {
        res.status(500).send({
            success: false,
            message: error.message,
            data: {}
        })
    }
}

// UPDATE DATA
exports.update = async (req, res) => {
    
    const id = req.params.id
    const category = req.body.category
    const slug_data = slug(category, {lower: true});
    const description = req.body.description

    if (!category ||
        !description) {
        res.status(400).send({
            success: false,
            message: "category or description can't be empty",
            data: {}
        })
        return
    }

    try{
        const data = await CategoryOleholeh.updateOne({ _id: id }, {
            $set: {
                category: category,
                slug: slug_data,
                description: description
            }
        }, { useFindAndModify: false })

        if (!data) {
            res.status(404).send({
                success: false,
                message: "id not found",
                data: {}
            })
            return
        }

        const findData = await CategoryOleholeh.findOne({_id: id})

        const dataArray = [findData]
        let dataUpdate = dataArray.map(item => {
            return {
                "id": item._id,
                "category": item.category,
                "description": item.description,
                "slug": item.slug,
                "createdAt": item.createdAt,
                "updatedAt": item.updatedAt
            }
        })

        res.status(200).send({
            success: true,
            message: "success update data",
            data: dataUpdate
        })

    }catch(error) {
        res.status(500).send({
            success: false,
            message: error.message,
            data: {}
        })
    }
}