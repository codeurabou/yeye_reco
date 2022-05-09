const express = require("express")
const router = express.Router()
const boutiqueCtrl = require("../controllers/boutiques")

//TODO : Ajouter une route qui affiche les stat de la boutique

router.get("/", boutiqueCtrl.getAllBoutique)
router.get("/utilisateur/:usId", boutiqueCtrl.getUserBoutique) // ! important lors de la connexion
router.get("/stats/:boId", boutiqueCtrl.getBoutiqueStat)
router.post("/", boutiqueCtrl.addBoutique)
router.get("/:boId", boutiqueCtrl.getBoutique)
router.put("/:boId", boutiqueCtrl.editBoutique)
router.delete("/:boId", boutiqueCtrl.deleteBoutique)

module.exports = router
