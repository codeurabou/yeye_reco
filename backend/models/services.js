// Table service
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("services", {
        se_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        debut: { type: DataTypes.DATE, allowNull: false },
        fin: { type: DataTypes.DATE, allowNull: false },
        cl_nom: { type: DataTypes.STRING(90), allowNull: false },
        etat: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        gr_id: { type: DataTypes.INTEGER, allowNull: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { updatedAt: false })
}