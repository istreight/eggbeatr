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

// CSS
import { buttons } from 'pure-css';
import './css/pure.css';
import './css/style.css';

// Components
import Header from './components/Header';
import Landing from './components/Landing';
import About from './components/About';
import LIPReader from './components/LIPReader';
import Grid from './components/Grid';
import GridChecklist from './components/GridChecklist';
import Footer from './components/Footer';


var lipReader = new LIPReader();
var gridChecklist = new GridChecklist();

// Render components to static div tags.
ReactDOM.render(<Header />, document.getElementById('dynamicHeader'));
ReactDOM.render(<Landing />, document.getElementById('dynamicLanding'));
ReactDOM.render(<About />, document.getElementById('dynamicAbout'));
ReactDOM.render(<Footer />, document.getElementById('dynamicFooter'));


ReactDOM.render(<Grid
    lipData={lipReader.manipulateData()}
/>, document.getElementById('dynamicGrid'));

// renderComponents renders Lessons, Instructors, and Private to static div tags.
lipReader.renderComponents(gridChecklist.renderComponent());
