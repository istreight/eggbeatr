/**
 * FILENAME:    Input.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Input class, a utility class for input tags
 *  in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


class Input extends React.Component {
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
  checked: false
};

Input.propTypes = {
    callback: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    handleBlur: PropTypes.func.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    styleClass: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
}

export default Input;
