// Table depenses
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("depenses", {
        dep_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        dep_motif: { type: DataTypes.TEXT, allowNull: false },
        dep_mte: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 }, // prix minimum dans l'application
        gr_id: { type: DataTypes.INTEGER, allowNull: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false },
    }, { updatedAt: false })
}