const sequelize = require('../database/db');
const {DataTypes} = require('sequelize');

const product = sequelize.define('products', {
    id:{
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING(50),
        allowNull:true,
    },
    price:{
        type: DataTypes.STRING(50),
        allowNull:false,
        unique: true
    },
    image:{
        type: DataTypes.STRING(50),
        allowNull:false,
    }
});
module.exports = product;