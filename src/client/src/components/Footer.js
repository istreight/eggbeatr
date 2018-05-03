/**
 * FILENAME:    Footer.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the About class that displays content about the
 *  contruction of the lesson calendar web application.
 * The Footer class is exported.
 */

import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <div>
                Made with &hearts;<br />
                by Isaac Streight
                <p>
                    Created during Winter 2016<br />
                    on BC&#39;s beautiful coast
                </p>
                <ul>
                    <li>
                        Powered by
                    </li>
                    <li>
                        <a href="https://facebook.github.io/react/">React</a>,
                        <a href="https://webpack.github.io"> Webpack</a>,
                        <a href="https://babeljs.io"> Babel</a>, &
                        <a href="http://purecss.io"> PureCSS</a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Footer;
