module.exports = mongoose => {
    const slug = require('mongoose-slug-updater');
    const autoIncrement = require('mongoose-auto-increment');
    const Schema = mongoose.Schema
    autoIncrement.initialize(mongoose.connection)
    mongoose.plugin(slug)
    const productOlehOleh = new Schema({
        _id: {
            type: Schema.Types.ObjectId
        },
        title: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            slug: ['title','_id'],
            require: true
        },
        store: {
            id: {
                type: Number,
                require: true
            },
            name: {
                type: String,
                require: true
            },

        },
        description: {
            type: String
        },
        categories: [{
            category: {
                type: String,
                require: true,
                ref: "category_oleholeh"
            }
        }],
        assets: {
            images: {
                type: Array
            },
            videos: {
                type: Array
            },
        },
        shipping: {
            demension: {
                heigth: {
                    type: Number
                },
                length: {
                    type: Number
                },
                width: {
                    type: Number
                }
            },
            weigth: {
                type: Number
            },
        },
        reguler_price: {
            type: Number
        },
        sales: {
            price: {
                type: Number
            },
            start_date: {
                type: Date
            },
            end_date: {
                type: Date
            }
        },
        stock_qty: {
            type: Number
        },
        status: {
            type: String
        },

        deleted: {
            type: Boolean,
            index: true,
        }

    }, {
        timestamps: true
    })

    productOlehOleh.plugin(autoIncrement.plugin, {model: 'product_oleholeh', startAt: 1,
    incrementBy: 1});
    const productOleholehModel = mongoose.model("product_oleholeh", productOlehOleh)
    return productOleholehModel
}