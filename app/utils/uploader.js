const path = require('path');
const multer = require('multer');
const crypto = require("crypto");

module.exports = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'courses', 'covers'))
    }, filename: (req, file, cb) => {
        // Random way
        // const fileName = Date.now() + String(Math.random() * 9999)
        // Hash way
        const hashFileName = crypto.createHash('sha256').update(file.originalname).digest('hex')

        const ext = path.extname(file.originalname)
        
        // cb(null, fileName + ext)
        cb(null, hashFileName + ext)
    },
})