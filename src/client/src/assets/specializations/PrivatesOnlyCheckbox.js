/**
 * FILENAME:    PrivatesOnlyCheckbox.js
 * AUTHOR:      Isaac Streight
 * START DATE:  December 2nd, 2018
 *
 * This file contains the PrivatesOnlyCheckbox class, a specialization
 *  class for priavates only instructor checkbox tags in Instructors section
 *  of the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'utils/Checkbox';


class PrivatesOnlyCheckbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.checkbox = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    handleChange(toggle) {
        this.state.handleChange(this.state.instructorId, !this.state.checked);
        this.setState({
            "checked": toggle
        });
    }

    toggleState(enable) {
        this.checkbox.toggleState(enable);
    }

    render() {
        return (
            <Checkbox
                callback={ (ref) => this.checkbox = ref }
                checked={ this.state.checked }
                disabled={ this.state.disabled }
                handleChange={ this.handleChange.bind(this) }
            />
        );
    }
}

PrivatesOnlyCheckbox.defaultProps = {
    callback: () => null,
    checked: false,
    disabled: false
}

PrivatesOnlyCheckbox.propTypes = {
    callback: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    instructorId: PropTypes.number.isRequired
}

export default PrivatesOnlyCheckbox;
