const Sequelize = require('sequelize');

const connector = new Sequelize('nodeproject', 'theju', 'theju@3000', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

});

module.exports = connector;