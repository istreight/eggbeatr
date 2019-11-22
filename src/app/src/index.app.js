/**
 * FILENAME:    app.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file is the entry point for the lesson calendar web application.
 */


import PureCSS from 'pure-css';

import 'css/pure.css';
import 'css/style.css';
import Controller from 'components/Controller';


const controller = new Controller({
    "githubURI": "https://api.github.com/repos/istreight/eggbeatr",
    "serverURI": "http://localhost:8081"
});

controller.init().then(() => controller.renderComponents());
