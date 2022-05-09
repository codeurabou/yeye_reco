const { vendreModel, venteModel,
    produitModel,
    sequelize,
} = require("../database/sequelize")
const checkBody = require("../utils/checkBody")
const backup = require("../utils/backup")

// // TODO : Ajouter le systeme de corbeille
// TODO : Modifier la vente si necessaire
// TODO : CRUD au niveau de vente si necessaire
const vendreCtrl = {
    // c'est l'operation le plus lourd de l'application et delicat (protection exterieur)
    addShopVendre(req, res) {
        const { bo_id, cl_id, us_id, basket } = req.body
        const { isValid } = checkBody(bo_id, cl_id, us_id, basket)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        if (basket.length <= 0) return res.status(400).json({ message: "aucun produit dans le pannier" })
        const totals = basket.length
        let pushed = 0
        // * creation de la vente
        vendreModel.create({ bo_id, cl_id, us_id })
            .then((vendre) => {
                const { vend_id } = vendre
                // * vendre les produit du pannier
                basket.forEach(d => {
                    const { qte, prix, mo_id, pr_id } = d // #vend_id,#bo_id
                    const { isValid } = checkBody(qte, prix, mo_id, pr_id)
                    if (isValid === false) return res.status(400).json({ messsage: "champ de produit incomplet" })
                    // * chercher le produit
                    produitModel.findByPk(pr_id)
                        .then(produit => {
                            if (!produit) return res.status(400).json({ message: "produit introuvable" })
                            const { pr_qte, pr_prix, pr_sold } = produit
                            if (qte > pr_qte) return res.status(400).json({ message: "stock insuffisant" })
                            const rest = pr_qte - qte
                            venteModel.create({
                                vend_id, bo_id, pr_id, mo_id, ven_qte: qte, ven_prix: prix,
                                ven_pay: mo_id === 1 ? 0 : prix // produit vendus par dettes
                            })
                                .then(() => {
                                    produitModel.update({ pr_qte: rest, pr_sold: pr_sold + 1 }, { where: { pr_id: pr_id } })
                                    pushed++
                                    if (pushed === totals) return res.status(200).json({ message: "terminer" })
                                })
                                .catch(err => {
                                    const constraint = err?.original?.constraint
                                    if (constraint === "ventes_unique1") return res.status(400).json({ message: "le produit est unique dans le pannier" })
                                    if (constraint === "ventes_check1") return res.status(400).json({ message: "la quantité doit est etre supperieur ou egale a zero" })
                                    if (constraint === "ventes_check2") return res.status(400).json({ message: "le prix minimum est 100" })
                                    if (constraint === "ventes_check3") return res.status(400).json({ message: "la somme payé n'est pas negatif" })
                                })
                        })
                })
            })
            .catch(err => {
                const constraint = err?.original?.constraint
                if (constraint === "vendres_fkey1") return res.status(400).json({ message: "Boutique introuvable" })
                if (constraint === "vendres_fkey2") return res.status(400).json({ message: "utilisateur introuvable" })
                if (constraint === "vendres_fkey3") return res.status(400).json({ message: "client introuvable" })
                return res.status(400).json({ err })
            })
    },
    getShopVendre(req, res) {
        const { boId } = req.params
        sequelize
            .query(
                `select vendres.us_id,us_prenom,us_nom,vendres.cl_id,cl_nom,cl_adr,cl_tel,vend_id,vendres."createdAt" 
                from vendres inner join utilisateurs on utilisateurs.us_id=vendres.us_id 
                inner join clients on clients.cl_id=vendres.cl_id where vendres.bo_id=${boId} and vendres.disabled=false
        `,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((result) => res.json(result))
            .catch((err) => res.status(400).json({ err }))
    },
    getShopVendreTrash(req, res) {
        const { boId } = req.params
        sequelize
            .query(
                `
            select vendres.us_id,us_prenom,us_nom,vendres.cl_id,cl_nom,cl_adr,cl_tel,vend_id,vendres."createdAt" 
                from vendres inner join utilisateurs on utilisateurs.us_id=vendres.us_id 
                inner join clients on clients.cl_id=vendres.cl_id where vendres.bo_id=${boId} and vendres.disabled=true
        `,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((result) => res.json(result))
            .catch((err) => res.status(400).json({ err }))
    },
    getVendreVente(req, res) {
        const { vendId } = req.params
        sequelize
            .query(
                `
            select ventes.pr_id,pr_nom as ven_nom,pr_unite as ven_unite,ven_qte,ven_prix,ven_pay,mo_id,ventes.bo_id 
            from ventes inner join produits on produits.pr_id=ventes.pr_id where vend_id=${vendId}
        `,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((result) => res.json(result))
            .catch((err) => res.status(400).json({ err }))
    },
    deleteShopVendre(req, res) {
        const { vendId } = req.params
        const { type } = req.query
        // ** systeme de corbeille
        backup(type, vendreModel, "vend_id", vendId, (err, data) => {
            if (err) return res.status(400).json({ err })
            return res.json({ ...data })
        })
    },
}

module.exports = vendreCtrl
