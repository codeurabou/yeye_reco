// Mise en place du fonction cors
const cors = (val) => `Access-Control-Allow-${val}`
module.exports = (req, res, next) => {
    res.setHeader(cors("Origin"), "*");
    res.setHeader(cors("Headers"), "Accept,Application,Authorization,Content,Content-Type,Origin,X-Requested-With");
    res.setHeader(cors("Methods"), "GET,POST,PUT,PACTH,DELETE,OPTIONS");
    next();
}