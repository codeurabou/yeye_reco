// Table vendre
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("vendre", {
        vend_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
        cl_id: { type: DataTypes.INTEGER, allowNull: false },
        us_id: { type: DataTypes.INTEGER, allowNull: false },
        disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        bo_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { updatedAt: false })
}