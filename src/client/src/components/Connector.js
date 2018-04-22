/**
 * FILENAME:    Connector.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 17th, 2018
 *
 * This file contains the Connector class that links the front-end & back-end
 *  points of the application.
 * This component uses network requests to query data from the server.
 */

import React from 'react';

class Connector extends React.Component {
    constructor(props) {
        super(props);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.status === 200) {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.open('GET', props.serverURI);
        xhr.send();
    }

    get() {

    }

    set() {

    }
}

export default Connector;
