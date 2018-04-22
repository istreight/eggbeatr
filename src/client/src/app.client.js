/**
 * FILENAME:    app.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file is the entry point for the lesson calendar web application.
 */


// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import PureCSS from 'pure-css';

// CSS
import './assets/css/pure.css';
import './assets/css/style.css';

// Components
import Connector from './components/Connector';
import Controller from './components/Controller';


new Controller();
new Connector({
    'serverURI': 'http://localhost:8081'
});
