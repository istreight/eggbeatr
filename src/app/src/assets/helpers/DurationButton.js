/**
 * FILENAME:    DurationButton.js
 * AUTHOR:      Isaac Streight
 * START DATE:  July 15th, 2018
 *
 * This file contains the DurationButton class, a specialization class
 *  for the duration buttons of the Grid section.
 */

import React from 'react';
import PropTypes from 'prop-types';


class DurationButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    componentDidMount() {
        this.props.callback(this);
        this.setNumericDuration();
    }

    handleClick() {
        var styleClass = this.state.styleClass;

        this.setState({
            "styleClass": styleClass + " pure-menu-selected"
        });

        this.state.handleClick(this.duration);
    }

    /**
     * Translate the textual representation of the duration button
     *  to a float value.
     */
    setNumericDuration() {
        var duration;
        var text = this.state.data.replace(" hours", "");

        duration = parseInt(text[0], 10);

        if (text.includes("\u00BD")) {
            duration += 0.5;
        }

        this.duration = duration;

        return duration;
    }

    render() {
        return (
            <a className={ this.state.styleClass } onClick={ this.handleClick.bind(this) }>
                { this.state.data }
            </a>
        );
    }
}

DurationButton.defaultProps = {
    callback: () => null,
    styleClass: "pure-menu-link"
}

DurationButton.propTypes = {
    callback: PropTypes.func,
    data: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    styleClass: PropTypes.string
}

export default DurationButton;
