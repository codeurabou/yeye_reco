// Table fournisseurs 
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("fournisseurs", {
        fo_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        fo_nom: { type: DataTypes.STRING(90), allowNull: false },
        fo_tel: { type: DataTypes.STRING(21), allowNull: false },
        fo_adr: { type: DataTypes.TEXT, allowNull: false },
        fo_email: { type: DataTypes.STRING, allowNull: false },
        disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // systeme de corbeille
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { createdAt: false, updatedAt: false })
}