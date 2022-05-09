// Table droit
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("droits", {
        dr_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        dr_nom: { type: DataTypes.STRING(60), allowNull: false },
        dr_action: { type: DataTypes.STRING(21), allowNull: false },
        dr_etat: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        us_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { createdAt: false, updatedAt: false })
}