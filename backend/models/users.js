// Table utilisateurs
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("utilisateurs", {
        us_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        us_prenom: { type: DataTypes.STRING(60), allowNull: false },
        us_nom: { type: DataTypes.STRING(30), allowNull: false },
        us_role: { type: DataTypes.STRING(7), allowNull: false }, // role (admin,ger,prop)
        us_email: { type: DataTypes.STRING, allowNull: false },
        us_pass: { type: DataTypes.STRING(80), allowNull: false },
        us_tel: { type: DataTypes.STRING(21), allowNull: false },
        disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        bo_id: { type: DataTypes.INTEGER } // gerants appartient a une boutique
    }, { createdAt: true, updatedAt: false })
}   