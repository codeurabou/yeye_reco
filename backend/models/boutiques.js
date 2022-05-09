// Table boutiques
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("boutiques", {
        bo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        bo_nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bo_tel: {
            type: DataTypes.STRING(21),
            allowNull: false,
        },
        bo_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bo_adr: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        us_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { createdAt: true, updatedAt: false })
}