/**
 * FILENAME:    Anchor.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Anchor class, a utility class for anchor tags
 *  in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Anchor extends React.Component {
    constructor(props) {
        super(props);

        this.node = null;
        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
        this.node = ReactDOM.findDOMNode(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.updateProps) {
            this.setState(nextProps);
        }
    }

    render() {
        return (
            <a className={ this.state.styleClass } href={ this.state.hyperlink } onClick={ this.state.handleClick.bind(this) }>
                { this.state.data }
            </a>
        );
    }
}

Anchor.defaultProps = {
  updateProps: true
};

Anchor.propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]),
    handleClick: PropTypes.func.isRequired,
    hyperlink: PropTypes.string,
    styleClass: PropTypes.string.isRequired,
    updateProps: PropTypes.bool
}

export default Anchor;
