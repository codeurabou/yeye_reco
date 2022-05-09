// Table client
module.exports = (sequelize, DataTypes) => {
    sequelize.define("client", {
        cl_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        cl_nom: { type: DataTypes.STRING(90), allowNull: false },
        cl_tel: { type: DataTypes.STRING(25), allowNull: false },
        cl_adr: { type: DataTypes.TEXT, allowNull: false },
        // clé
        bo_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { createdAt: false, updatedAt: false })
};