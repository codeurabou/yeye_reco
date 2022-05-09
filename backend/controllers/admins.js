const { userModel, boutiqueModel } = require("../database/sequelize")
const checkBody = require("../utils/checkBody")

const adminCtrl = {
    createUserAccount(req, res) {
        const { us_prenom, us_nom, us_tel, us_email, us_pass, bo_nom, bo_adr, bo_email, bo_tel } = req.body // #us_id
        const { isValid, debug } = checkBody(us_prenom, us_nom, us_tel, us_email, us_pass, bo_nom, bo_adr, bo_email, bo_tel)
        if (isValid === false) return res.status(400).json({ message: "champs invalide" })
        userModel.create({
            us_prenom,
            us_nom,
            us_role: "prop",
            us_email,
            us_pass,
            us_tel
        })
            .then((user) => {
                // ** creation du boutique de l'utilisateur
                const { us_id } = user
                boutiqueModel.create({ bo_nom, bo_tel, bo_adr, bo_email, us_id })
                    .then(() => res.status(200).json({ message: "compte crée avec success" }))
                    .catch(err => {
                        // annuller l'operation (creation du compte utilisateur)
                        userModel.destroy({ where: { us_id: us_id } })
                        const constraint = err?.original?.constraint
                        if (constraint === "boutiques_unique1") return res.status(400).json({ message: "le boutique existe deja (mono_utilisateur)" })
                        return res.status(400).json({ err })
                    })
            })
            .catch((err) => {
                const constraint = err?.original?.constraint
                if (constraint === "utilisateurs_unique1") return res.status(400).json({ message: "nom et prenom dejas ajouter une difference" })
                if (constraint === "utilisateurs_unique2") return res.status(400).json({ message: "email est dejas pris" })
                if (constraint === "utilisateurs_unique3") return res.status(400).json({ message: "telephone dejas pris" })
                return res.status(400).json({ err })
            })
    },
    getAllUser(req, res) {
        userModel.findAll({ attributes: { exclude: ["us_pass"] }, where: { us_role: "prop" } })
            .then(users => res.status(200).json(users))
            .catch(err => res.status(400).json({ err }))
    },
    deleteAllUserData(req, res) {
        const { usId } = req.params
        userModel.findByPk(usId)
            .then(user => {
                if (!user) return res.status(400).json({ message: "utilisateur introuvable" })
                return res.json({ message: `vous-voulez supprimer tous les donnés de ${user.us_prenom}` })
            })
            .catch(err => res.status(400).json({ err }))
    }
}

module.exports = adminCtrl;