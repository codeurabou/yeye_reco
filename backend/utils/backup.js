// la fonction : suppression , d'activation et de restauration
// par convention nos tables auront l'attribut disabled

const backup = (_options = "des", model, attribute, id, cb) => { // retourner  {message + options fait}
    let message
    if (!_options || _options === "des") {
        // desactiver
        model.update({ disabled: true }, { where: { [attribute]: id } })
            .then(() => {
                message = "desactiver"
                cb(null, { message, options: _options })
            })
            .catch(err => cb(err))
    }
    else if (_options === "act") {
        // activer
        model.update({ disabled: false }, { where: { [attribute]: id } })
            .then(() => {
                message = "activer"
                cb(null, { message, options: _options })
            })
            .catch(err => cb(err))
    }
    // si c'est (act et del) => suppression
    else {
        model.destroy({ where: { [attribute]: id } })
            .then(() => {
                message = "supprimer"
                cb(null, { message, options: _options })
            })
            .catch(err => cb(err))
    }
}
module.exports = backup