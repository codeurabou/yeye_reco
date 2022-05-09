const express = require("express")
const router = express.Router()
const fournisseurCtrl = require("../controllers/fournisseurs")

/**
 * Protger les routes
 * Affciher les fournisseurs d'une boutique
 * Ajouter une nouvelle fournisseurs v
 * Modifier les informations d'un fournisseurs
 * Supprimer un fournisseurs
 * Ajouter le systeme de corbeille
 * 
 */

router.get("/boutique/:boId", fournisseurCtrl.getShopFournisseur)
router.get("/:foId", fournisseurCtrl.getFournisseur)
router.post("/", fournisseurCtrl.addFournisseur)
router.put("/:foId", fournisseurCtrl.editFournisseur)
// systeme de corbeille
router.get("/boutique/:boId/trash", fournisseurCtrl.getShopFournisseurTrash)
router.delete("/:foId", fournisseurCtrl.deleteFournisseur)

module.exports = router