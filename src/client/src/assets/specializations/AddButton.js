/**
 * FILENAME:    AddButton.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 20th, 2018
 *
 * This file contains the AddButton class, a specialization class for the
 *  Anchor React class, the buttons responsible for adding component items.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Anchor from 'utils/Anchor';


class AddButton extends React.Component {
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
            <Anchor
                callback={ this.state.callback.bind(this) }
                data={ "Add" }
                handleClick={ this.state.handleClick.bind(this) }
                styleClass={ "pure-button add" }
            />
        );
    }
}

AddButton.defaultProps = {
    callback: () => null
}

AddButton.propTypes = {
    callback: PropTypes.func,
    handleClick: PropTypes.func.isRequired
}

export default AddButton;
