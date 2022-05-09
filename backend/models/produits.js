// Table produit
module.exports = (sequelize, DataTypes) => {
    // attributs sku
    return sequelize.define("produits", {
        pr_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        pr_nom: { type: DataTypes.STRING(100), allowNull: false },
        pr_qte: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        pr_prix: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
        pr_sold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        pr_unite: { type: DataTypes.STRING(25), allowNull: false },
        // cle
        de_id: { type: DataTypes.INTEGER, allowNull: false },
        fo_id: { type: DataTypes.INTEGER, allowNull: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { updatedAt: false })
}