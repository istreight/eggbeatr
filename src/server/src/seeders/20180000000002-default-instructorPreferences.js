'use strict';

const path = require('path');
const ComponentData = require(
    path.resolve(process.env.INIT_CWD, 'etc/defaults/ComponentData.js')
);
const defaultData = (new ComponentData).getDefaultData();

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('InstructorPreferences', defaultData.InstructorPreferences, {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete('InstructorPreferences', null, {});
    }
};
