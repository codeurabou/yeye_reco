const { fournisseurModel } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")
const backup = require("../utils/backup")

const fournisseurCtrl = {
    getShopFournisseurTrash(req, res, next) {
        const { boId } = req.params
        // affciher les fournisseur annuler
        fournisseurModel.findAll({ where: { bo_id: boId, disabled: true } })
            .then(fournisseurs => res.json(fournisseurs))
            .catch(err => res.status(400).json({ err }))
    },
    getShopFournisseur(req, res, next) {
        const { boId } = req.params
        // afficher les fournisseurs de la boutique
        fournisseurModel.findAll({ where: { bo_id: boId, disabled: false } })
            .then((fournisseurs) => res.json(fournisseurs))
            .catch(err => res.status(400).json({ err }))
    },
    getFournisseur(req, res, next) {
        const { foId } = req.params
        // informations d'un fournisseur
        fournisseurModel.findByPk(foId)
            .then((fournisseur) => {
                if (!fournisseur) return res.status(400).json({ message: "fournisseur introuvable" })
                res.json(fournisseur)
            })
            .catch(err => res.status(400).json((err)))
    },
    addFournisseur(req, res, next) {
        const { nom, tel, adr, email, bo_id } = req.body
        const { isValid } = checkBody(nom, tel, adr, email, bo_id)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        // ajouter le fournisseur
        fournisseurModel.create({
            fo_nom: nom,
            fo_tel: tel,
            fo_adr: adr,
            fo_email: email,
            bo_id
        })
            .then(() => res.json({ message: "fournisseur ajouter" }))
            .catch(err => {
                const constraint = err?.original?.constraint
                if (constraint === "fournisseurs_unique1") return res.status(400).json({ message: "fournisseur existe déja" })
                if (constraint === "fournisseurs_unique2") return res.status(400).json({ message: "un fournisseur a déja ce numero" })
                if (constraint === "fournisseurs_unique3") return res.status(400).json({ message: "un fournisseur a déja cet email" })
                return res.status(400).json({ err })
            })
    },
    editFournisseur(req, res, next) {
        const { foId } = req.params
        const { nom, tel, adr, email } = req.body
        // chercher le fournisseurs
        fournisseurModel.findByPk(foId)
            .then(fournisseur => {
                if (!fournisseur) return res.status(400).json({ message: "fournisseur introuvable" })
                const dv = {
                    nom: nom || fournisseur.fo_nom,
                    tel: tel || fournisseur.fo_tel,
                    adr: adr || fournisseur.fo_adr,
                    email: email || fournisseur.fo_email
                }
                // mettre a jour les informations du fournisseurs
                fournisseurModel.update({ fo_nom: dv.nom, fo_tel: dv.tel, fo_adr: dv.adr, fo_email: dv.email }, { where: { fo_id: foId } })
                    .then(() => res.json({ message: "informations fournisseur mise à jour" }))
                    .catch(err => {
                        const constraint = err?.original?.constraint
                        if (constraint === "fournisseurs_unique1") return res.status(400).json({ message: "fournisseur existe déja" })
                        if (constraint === "fournisseurs_unique2") return res.status(400).json({ message: "un fournisseur a déja ce numero" })
                        if (constraint === "fournisseurs_unique3") return res.status(400).json({ message: "un fournisseur a déja cet email" })
                        return res.status(400).json({ err })
                    })
            })
            .catch(err => res.status(400).json({ err }))
    },
    deleteFournisseur(req, res, next) {
        const { foId } = req.params
        const { type } = req.query
        // activer , desactiver , restaurer
        backup(type, fournisseurModel, "fo_id", foId, (err, data) => {
            if (err) return res.status(400).json({ err })
            const { message, options } = data
            return res.json({ message, options })
        })
    }
}

module.exports = fournisseurCtrl;