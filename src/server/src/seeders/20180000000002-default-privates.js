'use strict';

const path = require('path');
const defaultData = require(
    path.resolve(process.env.INIT_CWD, 'etc/defaults/ComponentData.js')
);

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Privates', defaultData.Privates, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Privates', null, {});
    }
};
