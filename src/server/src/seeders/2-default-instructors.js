'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('Instructors');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Instructors', defaultData, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Instructors', null, {});
    }
};
