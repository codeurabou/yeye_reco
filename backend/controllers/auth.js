const { userModel } = require("../database/sequelize")
const bcrypt = require('bcrypt')
const checkBody = require("../utils/checkBody")

const generateAcessToken = require("../utils/generateToken")
const backup = require("../utils/backup")
require("dotenv").config()

// middleware pour la desactivation du compte utilisateur
const userCtrl = {
    createAccount(req, res, next) {
        const { prenom, nom, role, email, pass, tel, bo_id } = req.body
        // role : (admin,gerant,prop)
        const { isValid, debug } = checkBody(prenom, nom, role, email, pass, tel)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        if (role === "ger" && !bo_id) return res.status(400).json({ message: "id boutique requis" })
        if (role !== "ger" && bo_id) return res.status(400).json({ message: "id boutique non requis" })
        // crypted le mot de passe
        bcrypt.hash(pass, 10)
            .then((cryptedPass) => {
                userModel.create({
                    us_prenom: prenom,
                    us_nom: nom,
                    us_role: role,
                    us_email: email,
                    us_pass: cryptedPass,
                    us_tel: tel,
                    bo_id: bo_id || null
                })
                    .then(() => res.json({ message: "compte crée avec succes" }))
                    .catch(err => {
                        const constraint = err.original.constraint
                        if (constraint === "utilisateurs_unique1") return res.status(400).json({ message: "prenom et nom dajas pris ajouter une difference" })
                        if (constraint === "utilisateurs_unique2") return res.status(400).json({ message: "email dejas pris" })
                        if (constraint === "utilisateurs_unique3") return res.status(400).json({ message: "telephone dejas pris" })
                        if (constraint === "utilisateurs_check1") return res.status(400).json({ message: "role invalide" })
                        if (constraint === "utilisateurs_fkey1") return res.status(400).json({ message: "id boutique invalide" })
                        return res.status(400).json({ err })
                    })
            })
            .catch(err => res.status(500).json({ err }))
    },
    login(req, res, next) {
        // selection : boutique lors de la connexion
        const { email, pass } = req.body
        const { isValid } = checkBody(email, pass)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        userModel.findOne({ where: { us_email: email }, attributes: { exclude: ["createdAt"] } })
            .then((users) => {
                if (!users) return res.status(400).json({ message: "compte introuvable" })
                const userInfos = users.dataValues
                // utilisateur desactiver ne peut pas se connecter (gerants)
                if (userInfos.disabled) return res.status(400).json({ message: "compte desactiver" })
                // decrypter le mot de passe
                bcrypt.compare(pass, users.us_pass)
                    .then((valid) => {
                        if (!valid) return res.status(400).json({ message: "Mot de passe incorrect" })
                        // encoder les informations utilisateur dans le token
                        delete userInfos.us_pass
                        const token = generateAcessToken({ us_id: users.us_id, users: { ...userInfos } })
                        res.json({ ...userInfos, token })
                    })
                    .catch(err => res.status(400).json({ err }))
            })
            .catch(err => res.status(400).json({ err }))
    },
    changePass(req, res, next) {
        const { usId } = req.params
        const { oldPass, newPass } = req.body
        const { isValid } = checkBody(oldPass, newPass)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        if (oldPass === newPass) return res.status(400).json({ message: "les doit etres differents" })
        // chercher l'utilisateur
        userModel.findByPk(usId)
            .then((users) => {
                if (!users) return res.status(400).json({ message: "compte introuvable" })
                const userInfos = users.dataValues
                // verification d'identite : ancien vs crypte
                bcrypt.compare(oldPass, userInfos.us_pass)
                    .then((valid) => {
                        if (!valid) return res.status(400).json({ message: "Mot de passe incorrect" })
                        // crypted et enregistrer le nouveau
                        bcrypt.hash(newPass, 10)
                            .then((cryptedPass) => {
                                userModel.update({ us_pass: cryptedPass }, { where: { us_id: usId } })
                                    .then(() => res.json({ message: "mot de passe changer avec succés" }))
                                    .catch(err => res.status(400).json({ err }))
                            })
                            .catch(err => res.status(500).json({ err }))
                    })
                    .catch(err => res.status(500).json({ err }))
            })
            .catch(err => res.status(400).json({ err }))
    },
    deleteAccount(req, res, next) {
        //attribut disabled 
        const { id } = req.params
        const { type } = req.query // ?type
        // ** activation,desactivation,suppression with backup => corebeille
        backup(type, userModel, "us_id", id, (err, data) => {
            if (err) return res.status(400).json({ err })
            const { message, options } = data
            return res.json({ message, options })
        })

    },
}

module.exports = userCtrl