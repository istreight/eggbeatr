/**
 * FILENAME:    Input.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Input class, a utility class for input tags
 *  in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';


class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    componentDidMount() {
        this.props.callback(this);
    }

    handleChange(e) {
        this.setState({
            "value": e.target.value
        });
    }

    render() {
        return (
            <input
                className={ this.state.styleClass }
                checked={ this.state.checked }
                name={ this.state.name }
                onBlur={ this.state.handleBlur.bind(this) }
                onChange={ this.handleChange.bind(this) }
                placeholder={ this.state.placeholder }
                type={ this.state.type }
                value={ this.state.value }
            />
        );
    }
}

Input.defaultProps = {
    callback: () => null,
    checked: false,
    handleBlur: () => null,
    styleClass: "",
    value: ""
}

Input.propTypes = {
    callback: PropTypes.func,
    checked: PropTypes.bool,
    handleBlur: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    styleClass: PropTypes.string,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
}

export default Input;
