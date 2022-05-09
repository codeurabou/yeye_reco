const { userModel, droitModel, paiementModel, sequelize } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")

const userCtrl = {
    getShopUser(req, res, next) {
        const { boId } = req.params
        userModel.findAll({ where: { bo_id: boId }, attributes: { exclude: ["us_pass", "createdAt"] } })
            .then(users => res.json(users))
            .catch(err => res.status(400).json({ err }))
    },
    getUser(req, res, next) {
        const { usId } = req.params
        userModel.findOne({ where: { us_id: usId }, attributes: { exclude: ["us_pass", "createdAt"] } })
            .then((user) => {
                if (!user) return res.status(400).json({ message: "utilsateur introuvable" })
                return res.json(user)
            })
            .catch(err => res.status(400).json({ err }))
    },
    // droit
    getUserDroit(req, res, next) {
        const { usId } = req.params
        // les droit d'un gerants
        droitModel.findAll({ where: { us_id: usId } })
            .then(droits => res.json(droits))
            .catch(err => res.status(400).json({ err }))
    },
    addUserDroit(req, res, next) {
        const { nom, action, etat, us_id } = req.body
        const { isValid } = checkBody(nom, action, us_id)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        // cherche l'utilisateurs
        userModel.findByPk(us_id)
            .then(user => {
                if (!user) return res.status(400).json({ message: "utilisateur introuvable" })
                if (user.us_role !== "ger") return res.status(400).json({ message: "ne peut pas avoir de droit" })
                // ajouter le droit
                droitModel.create({ dr_nom: nom, dr_action: action, dr_etat: etat, us_id })
                    .then(() => res.json({ message: "droit ajouter" }))
                    .catch(err => {
                        const constraint = err?.original?.constraint
                        if (constraint === "droits_unique1") return res.status(400).json({ message: "droit déja attribuer" })
                        return res.status(400).json({ err })
                    })
            })
            .catch(err => res.status(400).json({ err }))
    },
    editUserDroit(req, res, next) {
        const { drId } = req.params
        const { etat } = req.body
        // Modification par droit
        droitModel.findByPk(drId)
            .then((droit) => {
                if (!droit) return res.status(400).json({ message: "droit introuvable" })
                // mise a jour
                droitModel.update({ dr_etat: etat }, { where: { dr_id: drId } })
                    .then(() => res.json({ message: "droit mise à jour" }))
                    .catch(err => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
    removeUseDroit(req, res, next) {
        const { drId } = req.params
        droitModel.findByPk(drId)
            .then(droit => {
                if (!droit) return res.status(400).json({ message: "droit introuvable" })
                droitModel.destroy({ where: { dr_id: drId } })
                    .then(() => res.json({ message: "droit retirer" }))
                    .catch(err => res.status(400).json({ err }))
            })
            .catch(err => res.status(400).json(err))
    },
    // paiement
    getShopPaiement(req, res, next) {
        const { boId } = req.params
        // jointure entre paiement et utilisateur
        sequelize.query(`
            select pa_id,paiements.bo_id,us_prenom,us_nom,pa_mte,mois,annee,paiements."createdAt" 
            from paiements inner join utilisateurs on utilisateurs.us_id=paiements.us_id where paiements.bo_id=${boId}
       `, { type: sequelize.QueryTypes.SELECT })
            .then(data => {
                // resouds le probleme de detail de l'application
                return res.json(data)
            })
            .catch(err => res.status(400).json({ err }))
    },
    // getUserPaiement(req, res, next) {
    //     const { usId } = req.params
    //     // afficher les paiements de l'utilisateur
    //     paiementModel.findAll({ where: { us_id: usId } })
    //         .then((paiements) => res.json(paiements))
    //         .catch(err => res.status(400).json({ err }))
    // },
    addUserPaiment(req, res, next) {
        const { mte, mois, annee, bo_id, us_id } = req.body
        const { isValid } = checkBody(mte, mois, annee, bo_id, us_id)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        // cherhcer l'utilisateur
        userModel.findByPk(us_id)
            .then(user => {
                if (!user) return res.status(400).json({ message: "utilisateur introuvable" })
                if (user.us_role !== "ger") return res.status(400).json({ message: "peut pas avoir de paiement" })
                // ajouter le paiement
                paiementModel.create({ pa_mte: mte, mois, annee, bo_id, us_id })
                    .then(() => res.status(200).json({ message: "paiement effectuer" }))
                    .catch(err => {
                        const constraint = err?.original?.constraint
                        if (constraint === "paiements_unique") return res.status(400).json({ message: "paiement dejas effectuer" })
                        if (constraint === "paiements_check1") return res.status(400).json({ message: "pas de montant negatif" })
                        if (constraint === "paiements_check2") return res.status(400).json({ message: "mois superieure au mois courante" })
                        if (constraint === "paiements_check3") return res.status(400).json({ message: "annee superieure a l'annee courante" })
                        if (constraint === "paiements_fkey2") return res.status(400).json({ message: "boutique introuvable" })
                        return res.status(400).json({ err })
                    })
            })
            .catch(err => res.status(400).json({ err }))

    },
    editPaiement(req, res, next) {
        const { paId } = req.params
        const { mte, mois, annee } = req.body
        // chercher le paiement
        paiementModel.findByPk(paId)
            .then((paiement) => {
                if (!paiement) return res.status(400).json({ message: "paiement introuvable" })
                // restauration des valeurs par defaut
                const dv = { mte: mte || paiement.pa_mte, mois: mois || paiement.mois, annee: annee || paiement.annee }
                // mise a jour
                paiementModel.update({ pa_mte: dv.mte, mois: dv.mois, annee: dv.annee }, { where: { pa_id: paId } })
                    .then(() => res.json({ message: "paiement mise à jour" }))
                    .catch(err => {
                        const constraint = err?.original?.constraint
                        if (constraint === "paiements_unique") return res.status(400).json({ message: "paiement dejas effectuer" })
                        if (constraint === "paiements_check1") return res.status(400).json({ message: "pas de montant negatif" })
                        if (constraint === "paiements_check2") return res.status(400).json({ message: "mois superieure au mois courante" })
                        if (constraint === "paiements_check3") return res.status(400).json({ message: "annee superieure a l'annee courante" })
                        if (constraint === "paiements_fkey2") return res.status(400).json({ message: "boutique introuvable" })
                        return res.status(400).json({ err })
                    })
            })
            .catch((err) => res.status(400).json({ err }))
    },
    removePaiement(req, res, next) {
        const { paId } = req.params
        paiementModel.findByPk(paId)
            .then((paiement) => {
                if (!paiement) return res.status(400).json({ message: "paiement introuvable" })
                paiementModel.destroy({ where: { pa_id: paId } })
                    .then(() => res.json({ message: "paiement supprimer" }))
                    .catch(err => res.status(400).json({ err }))
            })
            .catch(err => res.status(400).json({ err }))
    }
}

module.exports = userCtrl