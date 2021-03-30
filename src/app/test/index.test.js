/**
 * FILENAME:    index.test.js
 * AUTHOR:      Isaac Streight
 * START DATE:  February 4th, 2021
 *
 * This file is the entry point for the test suite of the lesson calendar web application.
 */

import "core-js/stable";
import "regenerator-runtime/runtime";


const specPath = process.env.TEST_SPEC;
const req = require.context('./spec', true, /^.*\Spec.js$/);

console.log('TEST_SPEC:', specPath);

if (specPath) {
    req(specPath);
} else {
    console.log(req.keys());
    req.keys().forEach(req);
}
