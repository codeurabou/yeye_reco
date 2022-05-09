const { depotModel } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")
const backup = require("../utils/backup")

const depotCtrl = {
  getShopDepotTrash(req, res, next) {
    const { boId } = req.params
    // affciher les elements a restaurer
    depotModel.findAll({ where: { bo_id: boId, disabled: true } })
      .then(depots => res.json(depots))
      .catch(err => res.status(400).json({ err }))
  },
  getDepots(req, res, next) {
    const { deId } = req.params
    // chercher un depot
    depotModel.findByPk(deId)
      .then((depot) => {
        if (!depot) return res.status(400).json({ message: "depot introuvable" })
        return res.json(depot)
      })
      .catch(err => res.status(400).json({ err }))
  },
  getShopDepot(req, res, next) {
    const { boId } = req.params
    depotModel.findAll({ where: { bo_id: boId, disabled: false } })
      .then((depots) => res.json(depots))
      .catch(err => res.status(400).json({ err }))
  },
  addDepot(req, res, next) {
    const { nom, desc, bo_id } = req.body
    console.log({ ...req.body })
    const { isValid } = checkBody(nom, desc, bo_id)
    if (isValid === false) return res.status(400).json({ message: "champs invalide" })
    // ** ajouter le depot
    depotModel.create({ de_nom: nom, de_desc: desc, bo_id })
      .then(() => res.status(200).json({ message: "depot ajouter" }))
      .catch(err => {
        const constraint = err.original.constraint
        if (constraint === "depots_unique1") return res.status(400).json({ message: "ce depot existe déja" })
        if (constraint === "depots_fkey1") return res.status(400).json({ message: "boutique introuvable" })
        return res.status(400).json({ err })
      })
  },
  editDepot(req, res, next) {
    const { deId } = req.params
    const { nom, desc } = req.body
    // modifier un depot
    depotModel.findByPk(deId)
      .then((depot) => {
        if (!depot) return res.status(400).json({ message: "depot introuvable" })
        // sauvegarder les valeurs par defaut
        const dv = { nom: nom || depot.de_nom, desc: desc || depot.de_desc }
        // modifier
        depotModel.update({ de_nom: dv.nom, de_desc: dv.desc }, { where: { de_id: deId } })
          .then(() => res.status(200).json({ message: "information depot mise a jour" }))
          .catch(err => {
            if (constraint === "depots_unique1") return res.status(400).json({ message: "ce depot existe déja" })
            if (constraint === "depots_fkey1") return res.status(400).json({ message: "boutique introuvable" })
            return res.status(400).json({ err })
          })
      })
      .catch(err => res.status(400).json({ err }))
  },
  deleteDepot(req, res, next) {
    const { deId } = req.params
    const { type } = req.query
    // backup
    backup(type, depotModel, "de_id", deId, (err, data) => {
      if (err) return res.status(400).json({ err })
      const { message, options } = data
      return res.json({ options, message })
    })

  }
};

module.exports = depotCtrl;
