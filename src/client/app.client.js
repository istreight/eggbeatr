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
import Grid from './components/Grid';
import About from './components/About';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Controller from './components/Controller';
import GridChecklist from './components/GridChecklist';


var controller = new Controller();
var gridChecklist = new GridChecklist();

// Render components to static div tags.
ReactDOM.render(<Header />, document.getElementById('dynamicHeader'));
ReactDOM.render(<Landing />, document.getElementById('dynamicLanding'));
ReactDOM.render(<About />, document.getElementById('dynamicAbout'));
ReactDOM.render(<Footer />, document.getElementById('dynamicFooter'));


ReactDOM.render(<Grid
    callback={controller.gridCallback}
    controller={controller}
    controllerData={controller.manipulateData()}
/>, document.getElementById('dynamicGrid'));

// renderComponents renders Lessons, Instructors, and Private to static div tags.
controller.renderComponents();
