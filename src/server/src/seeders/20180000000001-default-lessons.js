'use strict';

const path = require('path');
const defaultData = require(
    path.resolve(process.env.INIT_CWD, 'etc/defaults/ComponentData.js')
);

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Lessons', defaultData.Lessons, {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Lessons', null, {});
    }
};
