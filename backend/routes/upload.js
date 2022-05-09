const express = require("express")
const upload = require("../middlewares/multer")
const router = express.Router()

router.post("/", upload, (req, res, next) => {
    res.send("fichier uploader")
})

module.exports = router
