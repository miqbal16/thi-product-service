module.exports = mongoose => {
    const Schema = mongoose.Schema
    const categoryOleholeh = new Schema({
        slug: {
            type: String,
            require: true,
            ref: "product_oleholeh"
        }, 
        category: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
    
    }, {
        timestamps: true
    })

    const categoryOleholehModel = mongoose.model("category_oleholeh", categoryOleholeh)
    return categoryOleholehModel
}
