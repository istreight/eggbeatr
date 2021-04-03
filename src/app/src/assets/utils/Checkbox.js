/**
 * FILENAME:    Checkbox.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Checkbox class, a utility class for checkbox-type
 *  input tags in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';


class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props
        };
    }

    componentDidMount() {
        this.props.callback(this);
    }

    /**
     * Update the state of the checkbox.
     * @return {undefined} There is no value returned.
     */
    handleChange() {
        this.setChecked(!this.state.checked);
        this.state.handleChange(!this.state.checked);
    }

    /**
     * Set the checked state of the checkbox.
     * @param {Boolean} enable A boolean relating to the checked/unchecked status of the checkbox.
     */
    setChecked(enable) {
        this.setState({
            "checked": enable
        });
    }

    /**
     * Set the ability of the checkbox to be checked.
     * @param {Boolean} disable A boolean relating to the enabled/disabled status of the checkbox.
     */
    setDisabled(disable) {
        this.setState({
            "disabled": disable
        });
    }

    render() {
        return (
            <input
                checked={ this.state.checked }
                disabled={ this.state.disabled }
                onChange={ this.handleChange.bind(this) }
                type={ "checkbox" }
            />
        );
    }
}

Checkbox.defaultProps = {
    callback: () => null,
    checked: false,
    disabled: false
};

Checkbox.propTypes = {
    callback: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    handleChange: PropTypes.func.isRequired
}

export default Checkbox;
