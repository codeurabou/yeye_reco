const express = require("express")
const router = express.Router()

const userCtrl = require("../controllers/users")


router.get("/boutique/:boId", userCtrl.getShopUser)

// droit (afficher,modifier,supprimer)
router.post("/droit", userCtrl.addUserDroit)
router.get("/droit/:usId", userCtrl.getUserDroit)
router.put("/droit/:drId", userCtrl.editUserDroit)
router.delete("/droit/:drId", userCtrl.removeUseDroit)

// paiements (afficher,modifier,supprimer,ajouter)
// afficher les paiement de la boutique
router.post("/paiement", userCtrl.addUserPaiment)
router.get("/paiement/boutique/:boId", userCtrl.getShopPaiement)
// bouton detatil => palier le probleme avec la jointure
// router.get("/paiement/:usId", userCtrl.getUserPaiement)
router.put("/paiement/:paId", userCtrl.editPaiement)
router.delete("/paiement/:paId", userCtrl.removePaiement)

router.get("/:usId", userCtrl.getUser)

module.exports = router