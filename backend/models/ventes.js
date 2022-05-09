// Table vente
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ventes", {
        ven_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        // ven_nom: { type: DataTypes.STRING, allowNull: false },
        ven_qte: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        ven_prix: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
        ven_pay: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        mo_id: { type: DataTypes.INTEGER, allowNull: false, },
        pr_id: { type: DataTypes.INTEGER, allowNull: false, },
        bo_id: { type: DataTypes.INTEGER, allowNull: false, },
        vend_id: { type: DataTypes.INTEGER, allowNull: false, },
    }, { createdAt: false, updatedAt: false })
}