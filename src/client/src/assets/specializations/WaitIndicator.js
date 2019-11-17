/**
 * FILENAME:    WaitIndicator.js
 * AUTHOR:      Isaac Streight
 * START DATE:  July 7th, 2018
 *
 * This file contains the WaitIndicator class, the class for displaying
 *  wait indicators throughout the application.
 */

import React from 'react';
import PropTypes from 'prop-types';


class WaitIndicator extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    render() {
        return (
            <div className={ "wait-indicator " + this.state.indicatorStyleClass }>
                <div className={ "wait-spinner " + this.state.spinnerStyleClass }>
                    <span></span><span></span>
                </div>
                <div className={"wait-label " + this.state.labelStyleClass }>
                    { this.state.data }
                </div>
            </div>
        );
    }
}

WaitIndicator.propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.string.isRequired,
    indicatorStyleClass: PropTypes.string.isRequired,
    labelStyleClass: PropTypes.string.isRequired,
    spinnerStyleClass: PropTypes.string.isRequired
}

export default WaitIndicator;
