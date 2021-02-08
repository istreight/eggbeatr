'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('Lessons');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Lessons', defaultData, {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete('Lessons', null, {});
    }
};
