const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.productOleholeh = require("./productOleholeh.model.js")(mongoose);
db.categoryOleholeh = require("./categoryOleholeh.model.js")(mongoose);
db.paketData = require('./paketData.model.js')(mongoose);
module.exports = db;