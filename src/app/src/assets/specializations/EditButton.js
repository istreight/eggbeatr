/**
 * FILENAME:    EditButton.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the EditButton class, a specialization class for the
 *  Anchor React class, for buttons that toggle the "edit" states
 *  in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Anchor from 'utils/Anchor';


class EditButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    componentDidMount() {
        this.props.callback(this);
    }

    getData() {
        if (this.state.mode === "edit") {
            return "Finish Editing";
        } else {
            return "Edit";
        }
    }

    render() {
        return (
            <Anchor
                callback={ this.state.callback.bind(this) }
                data={ this.getData() }
                handleClick={ this.state.handleClick.bind(this) }
                styleClass={ "pure-button" }
            />
        );
    }
}

EditButton.defaultProps = {
    callback: () => null,
    mode: "default"
}

EditButton.propTypes = {
    callback: PropTypes.func,
    handleClick: PropTypes.func.isRequired,
    mode: PropTypes.string
}

export default EditButton;
