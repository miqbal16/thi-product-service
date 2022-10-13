const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();
const port = process.env.APP_PORT || 8080;
const db = require("./app/models");
const path = require('path')


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());



db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
}).then(() => {
    console.log("connected database");
}).catch(() => {
    console.log("cannot connect to the database");
    process.exit();
})


require("./app/routes/productOleholeh.routes")(app);
require("./app/routes/categoryOlehOleh.routes")(app);
require("./app/routes/productOlehOlehMobile.routes")(app);
require('./app/routes/paketData.routes')(app);
app.get('/', (req, res) => res.send("Welcome"));

app.use('/public/images', express.static(path.join(__dirname, '/public/images')));
app.use('/public/videos', express.static(path.join(__dirname, '/public/videos')));
app.use((req,res) => {
    res.status(404).json({
        success: false,
        message: "Url Not Found",
        data: []
    })
})

app.listen(port, () => console.log("Server Running on Port " + port));
module.exports.port = port