/**
 * FILENAME:    FeatureDescritpion.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 28th, 2018
 *
 * This file contains the FeatureDescritpion class, a specialization class for the
 *  feature descriptions of the application in the About section.
 */

import React from 'react';
import PropTypes from 'prop-types';


class FeatureDescritpion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src={ this.props.imgSrc } />
                <p className="feature-description">
                    { this.props.textDesc }
                </p>
            </div>
        );
    }
}

FeatureDescritpion.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    textDesc: PropTypes.string.isRequired
}

export default FeatureDescritpion;
