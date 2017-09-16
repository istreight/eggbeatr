/**
 * FILENAME:    Footer.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the About class that displays content about the contruction
 * of the lesson calendar web application. The Footer class is exported.
 *
 *
 * CHANGE LOG:
 *  19/10/16:
 *              Transfered code from index.html, written by PureCSS, Yahoo! Inc.
 *              Added Facebook & Instagram icons and links to personal accounts.
 *              Added React, Webpack, Babel, and PureCSS links.
 *              Added description on location of construction.
 *
 *  11/11/16:
 *              Changed name to Footer.
 */

import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <div id="about">
                Made with &hearts;<br />by Isaac Streight
                <div id="construction">
                    Created during Winter 2016<br />
                    on BC&#39;s beautiful coast
                </div>
                <div id="tools">
                    Powered by<br />
                    <a href="https://facebook.github.io/react/">React</a>,
                    <a href="https://webpack.github.io"> Webpack</a>,
                    <a href="https://babeljs.io"> Babel</a>, &
                    <a href="http://purecss.io"> PureCSS</a>
                </div>
            </div>
        );
    }
}

export default Footer;
