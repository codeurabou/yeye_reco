const express = require("express")
const router = express.Router()
const achatCtrl = require("../controllers/achats")


router.get("/boutique/:boId", achatCtrl.getShopAchat)
router.get("/commande/:acId", achatCtrl.getAchatCommand)
router.post("/", achatCtrl.addAchat)
router.post("/reception/:acId", achatCtrl.achatReception)
router.put("/:acId", achatCtrl.editAchat)
router.delete("/:acId", achatCtrl.removeAchat)

module.exports = router