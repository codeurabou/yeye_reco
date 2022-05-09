// Table depots
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("depots", {
        de_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        de_nom: { type: DataTypes.STRING, allowNull: false },
        de_desc: { type: DataTypes.STRING, allowNull: false },
        disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // corbeille
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { updatedAt: false })
}