const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Producto = sequelize.define('Producto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    precio: { type: DataTypes.FLOAT },
    categoria: { type: DataTypes.STRING },
    imagenUrl: { type: DataTypes.STRING },
}, {
    timestamps: false,
    tableName: 'Productos'
});

module.exports = Producto;