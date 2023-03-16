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
        allowNull:false,
    },
    price:{
        type: DataTypes.STRING(50),
        allowNull:false,
       
    },
    description:{
        type: DataTypes.TEXT,
        
    },
    image:{
        type: DataTypes.STRING(200),
        allowNull:false,
    }
});
module.exports = product;