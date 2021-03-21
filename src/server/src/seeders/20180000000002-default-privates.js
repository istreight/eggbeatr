'use strict';

const appRoot = require('app-root-path');
const ComponentData = require(appRoot + '/etc/defaults/ComponentData.js');
const defaultData = (new ComponentData).getDefaultData('Privates');

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Privates', defaultData, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Privates', null, {});
    }
};
