'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('Headers');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Headers', defaultData, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Headers', null, {});
    }
};
