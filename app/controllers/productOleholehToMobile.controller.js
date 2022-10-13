const db = require("../models");
const ProductOleholeh = db.productOleholeh;

exports.findAll = async (req, res) => {

    const startPrice = Number(req.query.start_price) || 0
    const endPrice = Number(req.query.end_price) || 0

    if (startPrice > endPrice) {
        res.status(400).send({
            message: "start price is not greater than end price",
        })
        return
    }
    console.log(req.query.title)

    ProductOleholeh.find({
        $or: [
            {
                $or: [{title: { $regex: `${req.query.title}`}}]
            },
            {
                "categories.category": { $regex: `${req.query.category}` }
            },
            {
                $and: [
                    { "sales.price": { $gte: `${startPrice}` } },
                    { "sales.price": { $lte: `${endPrice}` } }
                ]
            },
        ]
        , deleted: false,
    })
        .then(data => {
            res.status(200).send({
                success: true,
                message: "Success Search Data",
                data: data
            })
        })
        .catch(error => {
            res.status(500).send({
                success: false,
                message: "Fatal Error",
                data: error.message
            })
        })
}