'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('Grids');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Grids', defaultData, {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete('Grids', null, {});
    }
};
