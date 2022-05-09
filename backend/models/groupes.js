// Table groupe
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("groupes", {
        gr_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        gr_nom: { type: DataTypes.STRING(100), allowNull: false },
        gr_desc: { type: DataTypes.STRING, allowNull: false },
        gr_type: { type: DataTypes.STRING(25), allowNull: false }, // nom de fonctionnalités : stocks , services
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { createdAt: false, updatedAt: false })
}