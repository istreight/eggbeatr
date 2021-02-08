'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('InstructorPreferences');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('InstructorPreferences', defaultData, {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete('InstructorPreferences', null, {});
    }
};
