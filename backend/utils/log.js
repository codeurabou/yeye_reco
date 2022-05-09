module.exports = (req, res, next) => {
    const { url, method } = req
    console.log(`Requete : ${method} ${url}`)
    next()
}