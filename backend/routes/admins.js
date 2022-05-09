const express = require("express")
const router = express.Router()
const { createUserAccount, getAllUser, deleteAllUserData } = require("../controllers/admins")


// adduser
router.post("/user/add", createUserAccount)
// all users
router.get("/user/lists", getAllUser)
// TODO : les fonctionnalités qui attend
// Statistique sur l'application
// forcer la suppresion de l'utilisateur
router.delete("/user/:usId", deleteAllUserData)
// mot de passe admin oublier (secret)

module.exports = router