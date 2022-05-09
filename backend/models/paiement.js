// Table paiement
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("paiements", {
        pa_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        pa_mte: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        mois: { type: DataTypes.SMALLINT, allowNull: false },
        annee: { type: DataTypes.SMALLINT, allowNull: false },
        us_id: { type: DataTypes.INTEGER, allowNull: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { createdAt: true, updatedAt: false })
}