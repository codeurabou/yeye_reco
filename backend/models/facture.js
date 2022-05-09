// Table facture
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("factures", {
        fa_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        fa_titre: { type: DataTypes.STRING(90), allowNull: false },
        fa_desc: { type: DataTypes.TEXT, allowNull: false },
        fa_footer: { type: DataTypes.TEXT }, // peid de pages du facture pas obligatoire
        fa_url: { type: DataTypes.TEXT }, // url du photo uploader peut pas obligatoire
        bo_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { updatedAt: false })
}