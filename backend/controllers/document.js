const { sequelize, vendreModel, venteModel } = require("../database/sequelize")
const { bonAchat, facturePro } = require("../utils/lib/template")
const createError = require("../utils/error")
const generatePdf = require("../utils/lib/generatePdf")

const documentCtrl = {
    achatsPdf: async (req, res, next) => {
        const data = {}
        const { acId } = req.params

        // TODO : Par jointure boutique + achats + fournisseur => reste c'est les commandes (simple)
        sequelize
            .query(
                `select ac_id,bo_nom,bo_tel,bo_email,bo_adr,ac_date,ac_desc,achats."createdAt",fo_nom,fo_adr,fo_tel,fo_email
                    from achats inner join boutiques on boutiques.bo_id=achats.bo_id
                    inner join fournisseurs on fournisseurs.fo_id=achats.fo_id where ac_id=${acId}`,
                { type: sequelize.QueryTypes.SELECT }
            )
            .then((result) => {
                if (result.length === 0)
                    return res
                        .status(400)
                        .json({ message: "achat introuvable" })
                const getResult = result[0]
                // ** Preparez notre obj pour imprimer
                const {
                    fo_nom,
                    fo_email,
                    fo_adr,
                    fo_tel,
                    bo_nom,
                    bo_email,
                    bo_adr,
                    bo_tel,
                    ac_date,
                    ac_id,
                    createdAt,
                    ac_desc,
                } = getResult
                data.frs = { fo_nom, fo_email, fo_adr, fo_tel }
                data.provider = { bo_nom, bo_email, bo_tel, bo_adr }
                data.achat = { ac_date, createdAt, ac_desc }
                // ** Reste c'est les commandes
                // TODO : Par jointure Produits + fcommandes
                sequelize
                    .query(
                        `select pr_nom as fc_nom,pr_unite as fc_unite,fc_qte,fc_prix 
                         from fcommandes inner join produits on produits.pr_id=fcommandes.pr_id where ac_id=${ac_id}`,
                        { type: sequelize.QueryTypes.SELECT }
                    )
                    .then((commandes) => {
                        // return res.json(commandes)
                        const generateTbody = commandes.map((d) => {
                            return `
                                 <tr>
                                    <td>${d.fc_nom}</td>
                                    <td>${d.fc_unite}</td>
                                    <td>${d.fc_qte}</td>
                                    <td>${d.fc_prix}</td>
                                    <td>${d.fc_prix * d.fc_qte}</td>
                                </tr>`
                        }).join("")
                        const getSum = () => {
                            let sum = 0
                            for (el of commandes) {
                                sum += el.fc_qte * el.fc_prix
                            }
                            return sum
                        }
                        data.datas = generateTbody
                        data.sum = getSum()
                        generatePdf(bonAchat({ ...data }), {
                            format: "A4",
                            printBackground: true,
                            path: `./doc/bon_achats_de_${fo_nom}.pdf`,
                        }).then((data) => {
                            // * forcer le client a rendre le pdf
                            res.set("Content-Type", "application/pdf")
                            return res.send(data)
                        })
                    })
                    .catch((err) => res.status(400).json({ err }))
            })
            .catch((err) => res.status(400).json({ err }))
    },
    vendresPdf(req, res, next) {
        const { vendId } = req.params
        // TODO : Par  jointure boutique + vendre + client
        const data = {}
        sequelize.query(
            ` 
            select bo_nom,bo_tel,bo_email,bo_adr,vendres.cl_id,cl_nom,cl_tel,cl_adr,vendres."createdAt",vendres.us_id,vend_id 
                from vendres inner join boutiques on  boutiques.bo_id=vendres.bo_id 
                inner join clients on clients.cl_id=vendres.cl_id where vend_id=${vendId}
            `
            , { type: sequelize.QueryTypes.SELECT })
            .then(vendre => {
                if (vendre.length === 0) return res.status(400).json(next(401, err))
                const getResult = vendre[0]
                const { bo_nom, bo_adr, bo_tel, bo_email, cl_nom, cl_adr, cl_tel, vend_id, createdAt } = getResult
                data.clt = { cl_nom, cl_adr, cl_tel }
                data.provider = { bo_nom, bo_adr, bo_email, bo_tel }
                data.vendre = { createdAt, date: new Date().toLocaleDateString() }
                // TODO : jointure pour afficher le nom et l'unite

                sequelize.query(`
                    select ventes.pr_id,vend_id,pr_nom,pr_unite,ven_id,ven_qte,ven_prix,(ven_qte*ven_prix)mte 
                    from ventes inner join produits on produits.pr_id=ventes.pr_id where vend_id=${vend_id}
                `, { type: sequelize.QueryTypes.SELECT })
                    .then((produits) => {
                        const generateTableBody = produits.map(d => {
                            return (
                                `


                                `
                            )
                        })
                        data.datas = generateTableBody
                    })
                    .catch(err => next(createError(401, err)))
            })
            .catch(err => next(createError(401, err)))
    }
}

module.exports = documentCtrl
