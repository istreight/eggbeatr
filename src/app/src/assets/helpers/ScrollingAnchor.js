/**
 * FILENAME:    ScrollingAnchor.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the ScrollingAnchor class, a specialization class for anchor tags
 *  in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Anchor from '@utils/Anchor';
import Animator from '@utils/Animator';


class ScrollingAnchor extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    static getDerivedStateFromProps(nextProps) {
        return nextProps;
    }

    handleClick() {
        var target = "dynamic" + this.node.innerHTML;

        if (target.includes("eggbeatr")) {
            target = "dynamicHeader";
        }

        Animator.scroll(document.getElementById(target));
    }

    render() {
        return (
            <Anchor
                data={ this.state.data }
                handleClick={ this.handleClick }
                styleClass={ this.state.styleClass }
            />
        );
    }
}

ScrollingAnchor.defaultProps = {
    styleClass: "pure-menu-link"
}

ScrollingAnchor.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    styleClass: PropTypes.string
}

export default ScrollingAnchor;
