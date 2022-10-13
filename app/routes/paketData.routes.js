module.exports = app => {
    
    const paketDataController = require('../controllers/paketData.controller.js')
    const router = require("express").Router();

    router.get('/', paketDataController.allData)
    router.get('/:code', paketDataController.findData)
    app.use("/api/v1/mobile/paketdata", router)

}