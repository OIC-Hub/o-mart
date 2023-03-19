const Sequelize = require('sequelize');
const sequelize = new Sequelize('o_mart', 'root', 'Engineer1212@', {
    host:'localhost',
    dialect:'mysql'
});
module.exports = sequelize;