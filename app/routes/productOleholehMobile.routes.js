module.exports = app => {
    
    const productOleholeh = require("../controllers/productOleholehToMobile.controller.js");
    const router = require("express").Router();

    router.get("/", productOleholeh.findAll);
    app.use("/product/api/mobile/oleholeh", router)

}