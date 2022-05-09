const express = require("express")
const router = express.Router()
const produitCtrl = require("../controllers/produits")
const userControl = require("../middlewares/control")

/**
 * Produit
 * Affichez les produits de la boutique
 * Affichez les informations d'un produit
 * Ajouter un produit dans la boutique (depot + fournisseurs)
 * Mettre a jour les informations d'un produits
 * Supprimer un produits
 * Ajouter le systeme de corbeillage
 * Afficher les produits for fournisseur
 */

router.get("/:prId", produitCtrl.getProduct)
router.get("/boutique/:boId", produitCtrl.getShopProduct)
router.get("/fournisseur/:foId", produitCtrl.getFrsProduct)
router.get("/fournisseur/not/:foId/:boId", produitCtrl.getNotFrsProduct)
router.get("/depot/:deId", produitCtrl.getDepotProduct)
router.post("/", produitCtrl.addProduct)
router.put("/:prId", produitCtrl.updateProduct)
router.delete("/:prId", produitCtrl.removeProduct)

module.exports = router
