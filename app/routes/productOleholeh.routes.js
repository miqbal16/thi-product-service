module.exports = app => {
    
    const productOleholeh = require("../controllers/productOleholeh.controller.js");
    const express = require("express");
    const router = express.Router();
    const upload = require('../middleware/imageUploads')

    router.post("/", upload,productOleholeh.create);
    router.get("/", productOleholeh.findAll);
    router.get("/:slug", productOleholeh.findOne);
    router.put("/:slug", upload,productOleholeh.update);
    router.delete("/:slug", productOleholeh.remove);
    app.use("/product/api/web/oleholeh", router)

}