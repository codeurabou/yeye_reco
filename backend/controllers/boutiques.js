const { sequelize, boutiqueModel, userModel } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")

const boutiqueCtrl = {
    getBoutique(req, res, next) {
        const { boId } = req.params
        boutiqueModel.findByPk(boId)
            .then((boutique) => {
                if (!boutique) return res.status(400).json({ message: "boutique introuvable" })
                return res.json(boutique)
            })
            .catch(err => res.status(400).json({ err }))
    },
    getUserBoutique(req, res, json) {
        const { usId } = req.params
        // chercher l'utilisateur
        userModel.findByPk(usId)
            .then(user => {
                if (!user) return res.status(400).json({ message: "compte introuvable" })
                // role => chercher la boutiqie
                const getUserRole = user.us_role
                const getUserId = user.us_id
                const getBoId = user.bo_id
                const condObj = getUserRole === "prop" ? { where: { us_id: getUserId } } : { where: { bo_id: getBoId } }
                // chercher les informations de la boutique suivant le role
                boutiqueModel.findAll(condObj)
                    .then(boutiques => {
                        const total = boutiques.length
                        const userBoutique = boutiques
                        // faille de securité a corriger
                        res.json({ total, userBoutique })
                    })
                    .catch(err => res.status(400).json({ err }))
            })
            .catch(err => res.status(400).json({ err }))
    },
    getAllBoutique(req, res, next) {
        boutiqueModel.findAll()
            .then((boutiques) => res.json(boutiques))
            .catch(err => res.status(400).json({ err }))
    },
    addBoutique(req, res, next) {
        const { nom, tel, email, adr, us_id } = req.body
        const { isValid } = checkBody(nom, tel, email, adr, us_id)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        // compte proprietaire peut avoir de boutique
        userModel.findByPk(us_id)
            .then(user => {
                if (!user) return res.status(400).json({ message: "compte introuvable" })
                if (user.us_role !== "prop") return res.status(400).json({ message: "n'est pas un compte proprietaire" })
                // creation du boutique
                boutiqueModel.create({ bo_nom: nom, bo_tel: tel, bo_adr: adr, bo_email: email, us_id })
                    .then(() => res.json({ message: "boutique créee" }))
                    .catch(err => {
                        const constraint = err?.original?.constraint
                        if (constraint === "boutiques_unique1") return res.status(400).json({ message: "boutique existant" })
                        if (constraint === "boutiques_unique2") return res.status(400).json({ message: "email dejas pris" })
                        if (constraint === "boutiques_unique3") return res.status(400).json({ message: "telephone dejas pris" })
                        return res.status(400).json({ err })
                    })
            })
            .catch(err => res.status(400).json({ err }))
    },
    editBoutique(req, res, next) {
        const { boId } = req.params
        const { nom, tel, email, adr } = req.body
        const { isValid } = checkBody(nom, tel, email, adr)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        // modification des information de la boutique
        boutiqueModel.findByPk(boId)
            .then(boutique => {
                if (!boutique) return res.status(400).json({ message: "boutique introuvable" })
                // Modification des information de la boutique dv: defaultValues
                const dv = {
                    nom: nom || boutique.bo_nom,
                    tel: tel || boutique.bo_tel,
                    email: email || boutique.bo_email,
                    adr: adr || boutique.bo_adr
                }
                boutique.update({
                    bo_nom: dv.nom,
                    bo_tel: dv.tel,
                    bo_email: dv.email,
                    adr: dv.adr
                }, { where: { bo_id: boId } })
                    .then(() => res.json({ message: "information boutique mis a jour" }))
                    .catch(err => res.status(400).json({ err }))
            })
            .catch(err => res.status(400).json({ err }))
    },
    deleteBoutique(req, res, next) {
        const { boId } = req.params
        boutiqueModel.destroy({ where: { bo_id: boId } })
            .then(() => res.json({ message: "boutique supprimer" }))
            .catch(err => res.status(400).json({ err }))
    },
    getBoutiqueStat(req, res, next) {
        const { boId } = req.params
        boutiqueModel.findByPk(boId)
            .then(boutique => {
                if (!boutique) return res.status(400).json({ message: "boutique introuvable" });
                return res.json(boutique)
            })
            .catch(err => res.status(400).json({ err }))
    }
}

module.exports = boutiqueCtrl