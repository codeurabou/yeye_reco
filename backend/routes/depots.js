const express = require("express")
const router = express.Router()
const depotCtrl = require("../controllers/depots")
const auth = require("../middlewares/auth")


/**
 * *************** Depots ******************
 * Afficher les informations d'un depot
 * Afficher les depots d'une boutique
 * Ajouter un depot
 * Modifier un depot
 * Supprimer un depot
 */

// Gestion des depots
router.get("/:deId", auth, depotCtrl.getDepots)
router.get("/boutique/:boId", auth, depotCtrl.getShopDepot) // affiche les elements actifs
router.post("/", auth, depotCtrl.addDepot)
router.put("/:deId", auth, depotCtrl.editDepot)
// activation,restauration,suppression
router.get("/boutique/:boId/trash", depotCtrl.getShopDepotTrash) // affiche les elements du depots
router.delete("/:deId", depotCtrl.deleteDepot) // activer,supprimer,restaurer

module.exports = router;
