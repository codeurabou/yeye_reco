const express = require("express")
const app = express()

// ** Database with ORM
const { sequelize, isConnect } = require("./database/sequelize")
const cors = require("./utils/cors")
const log = require("./utils/log")

// ** Routes
const authRoutes = require("./routes/auth")
const boutiqueRoutes = require("./routes/boutiques")
const depotRoutes = require("./routes/depots")
const fournisseurRoutes = require("./routes/fournisseurs")
const produitRoutes = require("./routes/produits")
const userRoutes = require("./routes/users")
const achatRoutes = require("./routes/achats")
const uploadRoutes = require("./routes/upload")
const documentRoutes = require("./routes/document")
const vendreRoutes = require("./routes/vendres")
const adminRoutes = require("./routes/admins")

// security middleware
const auth = require("./middlewares/auth")
const upload = require("./middlewares/multer")

// Middleware
app.use(express.json())
app.use(cors)
app.use(log)

// ** Database connection
isConnect()
sequelize
    .sync({ alter: true, logging: false })
    .then(() => console.log("synchronisation reussit"))
    .catch(() => console.log("synchronisation echoué"))

const base = `/api/v1/`
// ** Routes Application
app.use("/users_auth", authRoutes)
app.use("/boutiques", boutiqueRoutes)
app.use("/depots", depotRoutes)
app.use("/fournisseurs", fournisseurRoutes)
app.use("/produits", produitRoutes)
app.use("/users", userRoutes)
app.use("/achats", achatRoutes)
app.use("/vendres", vendreRoutes)
app.use("/uploads", uploadRoutes)
app.use("/documents", documentRoutes)
app.use("/admins", adminRoutes)
// error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || "500"
    const errorMessage = err.message || "Quelque chose c'est mal passé"
    const errorStack = err.stack
    return res.status(errorStatus).json({ stack: errorStack, message: errorMessage })
})

module.exports = app
