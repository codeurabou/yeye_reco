// verifie les corps de requetes
const checkBody = (...val) => {
    // ne pas muter la valeur
    const values = [...val]
    // !el => peut genere une erreur pour les boolean ou inverser la logique
    const isValid = values.every((el) => (el !== undefined && el !== null && el !== "" && el !== ''))

    const valuesWithKey = Object.entries(values)
    // cas ou il y a d'element null => prevenir le developpeurs
    let positionStr = " "
    if (isValid === false) {
        valuesWithKey.forEach(data => {
            const key = parseInt(data[0], 10) + 1
            const value = data[1]
            if (!value) positionStr += ` element:${key}`
        })
    }
    // utilisation
    return { isValid, debug: positionStr }
}
module.exports = checkBody