const multer = require("multer")

const MIMES_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
}

// fileStroageEngine
const fileStroageEngine = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "./uploads")
    },
    filename(req, file, cb) {
        // compatible avec toute les plateforme
        const getFilename = file.originalname.split(".")[0].split(" ").join("_")
        const getExtension = MIMES_TYPES[file.mimetype]

        if (!getExtension) cb("invalide extension")
        cb(null, `${getFilename}_${Date.now()}.${getExtension}`)
    },
})

// upload middleware
const upload = multer({ storage: fileStroageEngine }).single("file") // like file to send request

module.exports = upload
