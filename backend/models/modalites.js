// Table modalite
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("modalites", {
        mo_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        mo_nom: { type: DataTypes.TEXT, allowNull: false },
    }, { createdAt: false, updatedAt: false })
}