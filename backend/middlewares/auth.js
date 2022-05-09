const jwt = require('jsonwebtoken')
require("dotenv").config()

module.exports = (req, res, next) => {
    try {
        // prevenir l'erreur pour le requetes qui non pas l'entete authorization
        if (!req.headers.authorization) return res.status(400).json({ message: "authorization requis" })
        const token = req.headers.authorization.split(" ")[1]
        const decodeToken = jwt.decode(token, process.env.TOKEN_SECRET)
        const userId = decodeToken.us_id

        // decodage du token et verification si necessaire du user id encoder dans le token
        if (decodeToken) {
            if (req.body.us_id && parseInt(req.body.us_id, 10) !== userId) throw "ID utilisateur invalide"
            next()
        }

    } catch (err) { return res.status(400).json({ err }) }
}