const multer = require('multer');
const path = require('path');
const util = require('util');
const maxSize = 10 * 1000 * 1000

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, './public/image/oleholeh')
        } else {
            cb(new Error('input data error in image field'), false);
        }
    },
    filename: (req, file, cb) => {

        if(!req.body.title)
        {
            return
        }

        let count = 0
        req.files.forEach((_, i) => {
            count = i;
            i += 1;
        })

        const name = req.body.title
        const createNewNameImage = name.replace(/\s/g, '-')
        const nameImage = `${new Date().getDate()}${(new Date().getMonth() + 1)}${new Date().getFullYear()}-${createNewNameImage}-${count + 1}-product-oleh-oleh${path.extname(file.originalname)}`
        cb(null, nameImage);

    }
})

// VALIDATION IMAGE INPUT FORMAT
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        
        cb(new Error('the input file does not match the format'), false);
    }
}

const uploadFile = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxSize } }).array('images');
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware