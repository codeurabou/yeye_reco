const { Sequelize, DataTypes } = require("sequelize")

// ** Models
const boutiques = require("../models/boutiques")
const depenses = require("../models/depenses")
const depots = require("../models/depots")
const droit = require("../models/droit")
const facture = require("../models/facture")
const fournisseurs = require("../models/fournisseurs")
const groupes = require("../models/groupes")
const modalites = require("../models/modalites")
const paiement = require("../models/paiement")
const produits = require("../models/produits")
const services = require("../models/services")
const users = require("../models/users")
const vendre = require("../models/vendre")
const ventes = require("../models/ventes")
const achats = require("../models/achats")
const fcommande = require("../models/fcommande")
const clients = require("../models/clients")


// Postgres + sequelize => Node js
const sequelize = new Sequelize({
    username: "abou",
    password: "abou@89",
    database: "dbyeye",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    // logging: false,
    timezone: "+00:00", // resoud le probleme d'heure (celui du pays)
})

const isConnect = () =>
    sequelize
        .authenticate({ logging: false })
        .then(() => console.log("connection reussit"))
        .catch(() => console.log("connection echoué"))

// ** 16 Models
const boutiqueModel = boutiques(sequelize, DataTypes)
const userModel = users(sequelize, DataTypes)
const droitModel = droit(sequelize, DataTypes)
const fournisseurModel = fournisseurs(sequelize, DataTypes)
const paiementModel = paiement(sequelize, DataTypes)
const produitModel = produits(sequelize, DataTypes)
const depotModel = depots(sequelize, DataTypes)
const achatModel = achats(sequelize, DataTypes)
const fcommandeModel = fcommande(sequelize, DataTypes)
const factureModel = facture(sequelize, DataTypes)
const vendreModel = vendre(sequelize, DataTypes)
const venteModel = ventes(sequelize, DataTypes)
const modaliteModel = modalites(sequelize, DataTypes)
const groupeModel = groupes(sequelize, DataTypes)
const serviceModel = services(sequelize, DataTypes)
const depenseModel = depenses(sequelize, DataTypes)
const clientModel = clients(sequelize, DataTypes)

module.exports = {
    sequelize,
    isConnect,
    // models
    userModel,
    boutiqueModel,
    depotModel,
    produitModel,
    fournisseurModel,
    droitModel,
    paiementModel,
    achatModel,
    fcommandeModel,
    factureModel,
    vendreModel,
    venteModel,
    clientModel
}
