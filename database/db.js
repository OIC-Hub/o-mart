const Sequelize = require('sequelize');
const sequelize = new Sequelize('o_mart', 'root', '', {
    host:'localhost',
    dialect:'mysql'
});
module.exports = sequelize;