// Table fcommande
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("fcommandes", {
        fc_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        fc_qte: { type: DataTypes.INTEGER, allowNull: false },
        fc_prix: { type: DataTypes.INTEGER, allowNull: false },
        // cle etrangere
        pr_id: { type: DataTypes.INTEGER, allowNull: false },
        ac_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { createdAt: false, updatedAt: false })
}