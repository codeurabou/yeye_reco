const jwt = require('jsonwebtoken')
require("dotenv").config()

const generateAccesToken = (obj, _exp = 1800) => jwt.sign(obj, process.env.TOKEN_SECRET, { expiresIn: `${_exp}s` })
module.exports = generateAccesToken