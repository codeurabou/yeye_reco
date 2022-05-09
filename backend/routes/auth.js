const express = require("express")
const router = express.Router()
const userCtrl = require("../controllers/auth")

/**
 * Creation de compte 
 * Connexion au compte
 * Changer de mot de passe
 * Suppression du compte (activation,desactivation)
 * */

router.post("/signup", userCtrl.createAccount)
router.post("/login", userCtrl.login)
router.put("/changepass/:usId", userCtrl.changePass)
router.delete("/:id/delete", userCtrl.deleteAccount)

module.exports = router