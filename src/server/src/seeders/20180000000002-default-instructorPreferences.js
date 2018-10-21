'use strict';

const path = require('path');
const defaultData = require(
    path.resolve(process.env.INIT_CWD, 'etc/defaults/ComponentData.js')
);

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('InstructorPreferences', defaultData.InstructorPreferences, {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('InstructorPreferences', null, {});
    }
};