const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('irondron_track', 'irondron_uriel20', 'G.wpH#(]?f.u', {
    host: '50.87.144.94',
    dialect: 'mysql',
});

module.exports = sequelize;