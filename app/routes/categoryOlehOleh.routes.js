module.exports = app => {
    
    const categoryOlehOleh = require('../controllers/categoryOleholeh.controller.js')
    const router = require("express").Router();

    router.get("/", categoryOlehOleh.findAll);
    router.post("/", categoryOlehOleh.create);
    router.put("/:id", categoryOlehOleh.update)
    app.use('/product/api/web/category', router)

}