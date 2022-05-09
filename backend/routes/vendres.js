const express = require("express")
const router = express.Router()
const { deleteShopVendre, addShopVendre, getVendreVente, getShopVendre, getShopVendreTrash } = require("../controllers/vendres")

// La gestion des vendres de la boutique
router.get("/boutique/:boId/trash", getShopVendreTrash)
router.get("/boutique/:boId", getShopVendre)
router.get("/vente/:vendId", getVendreVente)
router.post("/", addShopVendre)
router.delete("/:vendId", deleteShopVendre)


module.exports = router