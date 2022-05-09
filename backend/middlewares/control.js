const { userModel, droitModel } = require("../database/sequelize")

// fonctionnalité qui necessitent les droit
const features = ["stocks", "ventes", "dettes"]
const userControl = (nom, action) => {

    const hasFeatures = nom && features.includes(nom)
    return (req, res, next) => {
        // permet d'identifier l'utilisateur quelque soit son role
        const { us_id } = req.body
        // erreur possible
        if (!nom || !action) return res.status(400).json({ message: "nom et action requis" })
        if (!us_id) return res.status(400).json({ message: "us_id requis" })
        if (!hasFeatures) return res.status(400).json({ message: "fonctionnalité non pris en charge" })

        // chercher l'utilisateur ? pour savoir son role 
        userModel.findOne({ where: { us_id }, attributes: { exclude: ["us_pass", "createdAt", "disabled"] } })
            .then((user) => {
                if (!user) return res.status(400).json({ message: "utilisateur introuvable" })
                const getUserRole = user.us_role
                if (getUserRole === "prop") next() // proprietaire de la boutique
                else {
                    // faire ue recherche pour voir le droit
                    droitModel.findAll({ where: { us_id, dr_nom: nom, dr_action: action } })
                        .then(droit => {
                            if (droit.length === 0) return res.status(400).json({ message: "n'a pas de droit attribuer" })
                            const getDroit = droit[0].dr_etat
                            if (getDroit === true) next()
                            else return res.status(400).json({ message: "permission non accordé" })
                        })
                        .catch(err => res.status(400).json({ err }))
                }
            })
            .catch(err => res.status(400).json({ err }))

    }
}

module.exports = userControl