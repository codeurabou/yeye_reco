const express = require("express")
const router = express.Router()

const documentCtrl = require("../controllers/document")

// ** Bon d'achat
router.get("/achat/:acId", documentCtrl.achatsPdf)
router.get("/vendre/:vendId", documentCtrl.vendresPdf)

module.exports = router
