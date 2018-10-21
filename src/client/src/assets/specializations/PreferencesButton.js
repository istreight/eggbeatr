/**
 * FILENAME:    PreferencesButton.js
 * AUTHOR:      Isaac Streight
 * START DATE:  Oct 14th, 2018
 *
 * This file contains the PreferencesButton class, a specialization class
 *  for the Anchor React class, for displaying Instructor preferences
 *  from the Instructors component of the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Anchor from 'utils/Anchor';

class PreferencesButton extends React.Component {
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

    onClick() {
        this.state.handleClick(this.state.instructorName);
    }

    render() {
        return (
            <Anchor
                callback={ this.state.callback.bind(this) }
                data={ "..." }
                handleClick={ this.onClick.bind(this) }
                hyperlink={ "javascript:void(0)" }
                styleClass={ "pure-button preferences" }
            />
        );
    }
}

PreferencesButton.propTypes = {
    callback: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    instructorName: PropTypes.string.isRequired
}

export default PreferencesButton;
