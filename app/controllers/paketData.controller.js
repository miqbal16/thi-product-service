const axios = require('axios');
const db = require('../models');
const PaketData = db.paketData
const MongoClient = require("mongodb").MongoClient;

/* ---------------------------------------------------------- UTILITY ---------------------------------------------------------------------*/

function isNumeric(num){
    return !isNaN(num)
}

function validationDataAndFilter(response) {
    var array = response.data.data;

    if(array === [] || array === undefined)
    {
        console.log("Data Response is empty")
        return
    }

    array.forEach(element => {

        if (element.type === 'data' && element.active === true && element.problem === false) {
            var code = element.code;
            var name = element.name;
            var vendor_code = 'billfazz';
            var operatorcode = element.operatorCode;
            var status_active = element.active;
            var price = element.sellPrice;

            saveDatatoDB(code, name, vendor_code, operatorcode, status_active, price)
        }
    });
}
function saveDatatoDB(code, name, vendor_code, operatorcode, status_active, price) {

    var upData = new PaketData()
    upData.code = code;
    upData.name = name;
    upData.vendor_code = vendor_code;
    upData.operatorcode = operatorcode;
    upData.status_active = status_active;
    upData.price = price;
    upData.save();

}

// CREATE PAKET DATA FROM BILLFAZZ
async function paketData() {
    const uri = `mongodb://localhost:27017/product_service_db`;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        const collection = await client.db("product_service_db").collection("paket_datas");
        collection.drop(); 

        const response = await axios.get('https://secure.billfazz.com/sandbox/api/v1/products/client', {
            auth: {
                username: 'tokohaji',
                password: '516b859c94ec8f37dccb6f23a2e4c8c29dd675d39c4e894f13'
            }
        })

        validationDataAndFilter(response)
        console.log("add paket data from billfazz is success")
        client.close()
    } catch (err) {
        console.log(err.stack);
    }
}
const getOperatorByPhoneNumber = (collectionDataOperator, code_operator_input) => {

    let code_operator = null;

    for(let operator in collectionDataOperator)
    {
        for(let codeSeluler in collectionDataOperator[operator])
        {
            if(code_operator_input === collectionDataOperator[operator][codeSeluler])
            {
                code_operator = operator;
                break;
            }
        }
    }

    return code_operator

}

/* ----------------------------------------------------------------------------------------------------------------------------------------*/

// Call Paket Data From Billfazz
// paketData()

// GET ALL DATA WITH PHONE NUMBER PARAMETER
exports.allData = async (req, res) => {
    
    const no_hp_input = req.query.no_hp
    const currentPage = req.query.page || 1
    const perPage = req.query.perPage || 5
    let totalData;


    if(no_hp_input === undefined || no_hp_input === "")
    {
        res.status(400).json({
            message: "You must input number phone"
        })
        return
    }

   
    if(!isNumeric(no_hp_input))
    {
        res.status(400).json({
            message: "Please, you must enter data in the form of numbers"
        })
        return
    }

    const code_operator_input = no_hp_input.substring(0,4);
    
    let code_operator;
    const codeOperatorCollection = {
        "telkomsel_data": ["0812","0813","0821","0822","0852","0853","0823","0851","0811"],
        "indosat_data": ["0814","0815","0816","0855","0856","0857","0858"],
        "xl_data": ["0817","0818","0819","0859","0877","0878"],
        "axis_data": ["0838","0831","0832","0833"],
        "three_data": ["0895","0896","0897","0898","0899"],
        "smartfren_data": ["0881","0882","0883","0884","0885","0886","0887","0888","0889"]
    }

    code_operator = getOperatorByPhoneNumber(codeOperatorCollection, code_operator_input);

    PaketData.find({ operatorcode: code_operator})
    .countDocuments()
    .then(count => {
            totalData = count;
            return PaketData.find({operatorcode: code_operator}).select({
                "__v": 0,
            })
            .skip((parseInt(currentPage) - 1) * parseInt(perPage))
            .limit(parseInt(perPage))
     })
    .then(data => {
        res.status(200).send({
            status: true,
            message: "List Paket Data",
            data: data,
            total_data: totalData,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch(err => {
        res.status(500).send({
            success: false,
            message: err || "server error",
            data: {}
        })
    })
}

// GET ALL DATA WITH CODE PAKET DATA
exports.findData = async (req, res) => {
    const code = req.params.code
    try {
        const data = await PaketData.find({ code: code }).select({
            "__v": 0,
        });
        if (!data) {
            res.status(404).send({
                status: false,
                message: "Data not found",
                data: {}
            })
            return
        }
        res.status(200).send({
            status: true,
            message: "Detail Paket Data",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error || "server error",
            data: {}
        })
    }
}


