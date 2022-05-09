const {
    achatModel,
    fcommandeModel,
    produitModel,
    sequelize,
} = require("../database/sequelize")
const checkBody = require("../utils/checkBody")

const achatCtrl = {
    // affciher les achats de la boutique
    getShopAchat(req, res) {
        const { boId } = req.params
        // jointure afficher le fournisseur lors de l'achat
        sequelize
            .query(
                `
        select ac_id,fo_nom,ac_date,ac_etat,ac_desc,achats.fo_id,achats.bo_id 
        from achats inner join fournisseurs on fournisseurs.fo_id=achats.fo_id where achats.bo_id=${boId}
        `,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((data) => res.json(data))
            .catch((err) => res.status(400).json({ err }))
    },
    // afficher les details de l'achats
    getAchatCommand(req, res) {
        const { acId } = req.params
        // par jointure le nom ,unite du produit
        sequelize
            .query(
                `
            select pr_nom as fc_nom,pr_unite as fc_unite,fc_id,fc_qte,fc_prix,fcommandes.pr_id,ac_id 
            from fcommandes inner join produits on produits.pr_id=fcommandes.pr_id where ac_id=${acId}
        `,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((commandes) => res.json(commandes))
            .catch((err) => res.status(400).json({ err }))
    },
    addAchat(req, res) {
        const { date, etat, desc, fo_id, bo_id, commande } = req.body
        const { isValid } = checkBody(date, etat, desc, fo_id, bo_id, commande)
        if (isValid === false)
            return res.status(400).json({ message: "champs invalide" })
        if (commande.length <= 0)
            return res.status(400).json({ message: "aucun produit commandé" })

        achatModel
            .create({
                ac_date: date,
                ac_desc: desc,
                ac_etat: etat,
                fo_id,
                bo_id,
            })
            .then((data) => {
                const getAcId = data.ac_id
                let totals = commande.length
                // TODO  : tableaux qui contient les commandes lors de l'achat
                commande.forEach((d) => {
                    const { qte, prix, pr_id } = d
                    const { isValid } = checkBody(qte, prix, pr_id)
                    if (isValid === false)
                        return res
                            .status(400)
                            .json({ message: "erreur au niveau de l'achat" })
                    fcommandeModel.create({
                        fc_qte: qte,
                        fc_prix: prix,
                        pr_id,
                        ac_id: getAcId,
                    })
                })

                return res.json({ message: "terminé" })
            })
            .catch((err) => {
                const constraint = err?.original?.constraint
                if (constraint === "achats_unique1")
                    return res
                        .status(400)
                        .json({ message: "cette commande existe déja" })
                if (constraint === "achats_fkey1")
                    return res
                        .status(400)
                        .json({ message: "boutique introuvable" })
                if (constraint === "achats_fkey2")
                    return res
                        .status(400)
                        .json({ message: "fournisseur introuvable" })
                return res.status(400).json({ err })
            })
    },
    editAchat(req, res) {
        const { acId } = req.params
        const { desc, date } = req.body

        achatModel
            .findByPk(acId)
            .then((achat) => {
                if (!achat)
                    return res
                        .status(400)
                        .json({ message: "achats introuvable" })
                // restaurer les valeur par defaut
                const dv = {
                    desc: desc || achat.ac_desc,
                    date: date || achat.ac_date,
                }
                // mettre a jour l'achat ou receptionner l'achats
                achatModel
                    .update(
                        {
                            ac_etat: dv.etat,
                            ac_desc: dv.desc,
                            ac_date: dv.date,
                        },
                        { where: { ac_id: acId } }
                    )
                    .then(() =>
                        res.json({ message: "information achat mise à jour" })
                    )
                    .catch((err) => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
    removeAchat(req, res) {
        const { acId } = req.params
        // chercher l'achats
        achatModel
            .findByPk(acId)
            .then((achat) => {
                if (!achat)
                    return res
                        .status(400)
                        .json({ message: "achat introuvable" })
                // supprimer l'achats
                achatModel
                    .destroy({ where: { ac_id: acId } })
                    .then(() => res.json({ message: "achat supprimer" }))
                    .catch((err) => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
    // receptionner l'achats
    achatReception(req, res) {
        const { acId } = req.params
        // chercher l'achat qui contient les commandes
        achatModel
            .findByPk(acId)
            .then((achat) => {
                if (!achat)
                    return res
                        .status(400)
                        .json({ message: "achat introuvable" })
                if (achat.ac_etat === "1")
                    return res
                        .status(400)
                        .json({ message: "Achats déja receptionner" })
                // afficher les commandes lors de cet achat
                fcommandeModel
                    .findAll({ where: { ac_id: achat.ac_id } })
                    .then((commandes) => {
                        // receptionner les commandes
                        const getCommande = commandes
                        getCommande.map((d) => {
                            produitModel.findByPk(d.pr_id).then((produit) => {
                                const qte = produit.pr_qte + d.fc_qte
                                produitModel.update(
                                    { pr_qte: qte },
                                    { where: { pr_id: d.pr_id } }
                                )
                            })
                        })
                        // receptione l'achat globalement
                        achatModel
                            .update(
                                { ac_etat: "1" },
                                { where: { ac_id: acId } }
                            )
                            .then(() =>
                                res.json({ message: "achat receptionner" })
                            )
                            .catch((err) => res.status(400).json({ err }))
                    })
                    .catch((err) => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
}

module.exports = achatCtrl
