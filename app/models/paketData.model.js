module.exports = mongoose => {
    const paketDataModel =  mongoose.model('paket_data',mongoose.Schema({
        code: {
            type: String,
            require: true 
        },
        name: {
            type: String,
            require: true
        },
        vendor_code: {
            type: String,
            require: true
        },
        operatorcode: {
            type: String,
            require: true
        },
        status_active: {
            type: Boolean,
            require: true
        },
        price: {
            type: Number,
            require: true
        },

    },{
        timestamps: true
    }));

    return paketDataModel

}