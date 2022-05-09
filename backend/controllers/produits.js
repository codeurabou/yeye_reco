const { sequelize, produitModel } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")

const produitCtrl = {
    getShopProduct(req, res, next) {
        const { boId } = req.params
        const { type } = req.query
        // afficher les produits de la boutique

        produitModel
            .findAll({ where: { bo_id: boId } })
            .then((produit) => {
                if (!type) return res.sjon(produit)
                else {
                    if (type === "len") return res.json(produit.length)
                }
            })
            .catch((err) => res.status(400).json({ err }))
    },
    getProduct(req, res, next) {
        const { prId } = req.params
        // les informations d'un produit
        produitModel
            .findByPk(prId)
            .then((produit) => {
                if (!produit)
                    return res
                        .status(400)
                        .json({ message: "produit introuvable" })
                res.json(produit)
            })
            .catch((err) => res.status(400).json({ err }))
    },
    getFrsProduct(req, res, next) {
        const { foId } = req.params
        // les produits d'un fournisseurs
        produitModel
            .findAll({ where: { fo_id: foId } })
            .then((produit) => res.json(produit))
            .catch((err) => res.status(400).json({ err }))
    },
    getNotFrsProduct(req, res, next) {
        const { boId, foId } = req.params
        // afficher les produits hor fournisseur de la boutique
        sequelize
            .query(
                `select * from produits where bo_id=${boId} and fo_id!=${foId}`,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((produits) => res.json(produits))
            .catch((err) => res.status(400).json({ err }))
    },
    getDepotProduct(req, res, next) {
        const { deId } = req.params
        // les produit d'un depot
        // palier le probleme de details
        sequelize
            .query(
                `select pr_id,fo_nom,pr_nom,pr_qte,pr_prix,pr_sold,de_id,pr_unite
        from produits inner join fournisseurs on fournisseurs.fo_id=produits.fo_id where de_id=${deId}`,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((data) => res.json(data))
            .catch((err) => res.status(400).json({ err }))
    },
    addProduct(req, res, next) {
        const { nom, qte, prix, unite, de_id, bo_id, fo_id } = req.body
        const { isValid } = checkBody(nom, qte, prix, de_id, bo_id, fo_id)
        if (isValid === false)
            return res.status(400).json({ message: "champs invalide" })
        // ajouter le produit
        produitModel
            .create({
                pr_nom: nom,
                pr_qte: qte,
                pr_prix: prix,
                pr_unite: unite,
                de_id,
                fo_id,
                bo_id,
            })
            .then(() => res.status(200).json({ message: "produit ajouter" }))
            .catch((err) => {
                const constraint = err?.original?.constraint
                if (constraint === "produits_unique1")
                    return res.status(400).json({
                        message:
                            "Ce produit existe déja augmenter la quanité en cas d'approvisionnement",
                    })
                if (constraint === "produits_check1")
                    return res.status(400).json({
                        message:
                            "Quantité du produit supperieure ou egale à zero",
                    })
                if (constraint === "produits_check3")
                    return res.status(400).json({
                        message:
                            "Nombres d'achats du produit supperieure ou egale à zero",
                    })
                // cle etrangere
                if (constraint === "produits_fkey1")
                    return res
                        .status(400)
                        .json({ message: "boutique introuvable" })
                if (constraint === "produits_fkey2")
                    return res
                        .status(400)
                        .json({ message: "depot introuvable" })
                if (constraint === "produits_fkey3")
                    return res
                        .status(400)
                        .json({ message: "fournisseurs introuvable" })
                return res.status(400).json({ err })
            })
    },
    updateProduct(req, res, next) {
        const { prId } = req.params
        const { nom, qte, prix, unite, de_id } = req.body

        produitModel
            .findByPk(prId)
            .then((produit) => {
                if (!produit)
                    return res
                        .status(400)
                        .json({ message: "produit introuvable" })
                // restauration des valeurs par defaut
                const dv = {
                    nom: nom || produit.pr_nom,
                    qte: qte || produit.pr_qte,
                    prix: prix || produit.pr_prix,
                    unite: unite || produit.pr_unite,
                    deId: de_id || produit.de_id,
                }
                // mise a jour
                produitModel
                    .update(
                        {
                            pr_nom: dv.nom,
                            pr_qte: dv.qte,
                            pr_prix: dv.prix,
                            pr_unite: dv.unite,
                            de_id: dv.deId,
                        },
                        { where: { pr_id: prId } }
                    )
                    .then(() =>
                        res.json({ message: "information produit mise à jour" })
                    )
                    .catch((err) => {
                        const constraint = err?.original?.constraint
                        if (constraint === "produits_unique1")
                            return res.status(400).json({
                                message:
                                    "Ce produit existe déja augementer la quanité en cas d'approvisionnement",
                            })
                        if (constraint === "produits_check1")
                            return res.status(400).json({
                                message:
                                    "Quantité du produit supperieure ou egale à zero",
                            })
                        if (constraint === "produits_check3")
                            return res.status(400).json({
                                message:
                                    "Nombres d'achats du produit supperieure ou egale à zero",
                            })
                        // cle etrangere
                        if (constraint === "produits_fkey1")
                            return res
                                .status(400)
                                .json({ message: "boutique introuvable" })
                        if (constraint === "produits_fkey2")
                            return res
                                .status(400)
                                .json({ message: "depot introuvable" })
                        if (constraint === "produits_fkey3")
                            return res
                                .status(400)
                                .json({ message: "fournisseurs introuvable" })
                        return res.status(400).json({ err })
                    })
            })
            .catch((err) => res.status(400).json({ err }))
    },
    removeProduct(req, res, next) {
        const { prId } = req.params
        // supprimer un produit
        produitModel
            .findByPk(prId)
            .then((produit) => {
                if (!produit)
                    return res
                        .status(400)
                        .json({ message: "produit introuvable ou supprimer" })
                const getProductId = produit.pr_id
                // suppression
                produitModel
                    .destroy({ where: { pr_id: getProductId } })
                    .then(() => res.json({ message: "produit supprimer" }))
                    .catch((err) => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
}

module.exports = produitCtrl
