
// Table achats du fournisseurs 
// Date debut par defaut avec createdAt
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("achats", {
        ac_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        ac_desc: { type: DataTypes.STRING, allowNull: false },
        ac_date: { type: DataTypes.DATE, allowNull: false },
        ac_etat: { type: DataTypes.CHAR(1), allowNull: false },
        // cle etrangere
        fo_id: { type: DataTypes.INTEGER, allowNull: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { updatedAt: false })
}