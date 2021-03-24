/**
 * FILENAME:    test.js
 * AUTHOR:      Isaac Streight
 * START DATE:  February 4th, 2021
 *
 * This file is the entry point for the test suite of the lesson calendar web application.
 */

import "core-js/stable";
import "regenerator-runtime/runtime";


const req = require.context('./spec', true, /^.*\Spec.js$/);
console.log(req.keys());
req.keys().forEach(req);
