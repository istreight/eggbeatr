/**
 * FILENAME:    Anchor.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Anchor class, a utility class for anchor tags
 *  in the application.
 *
 * @format
 */
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
class Anchor extends React.Component {
    constructor(props) {
        super(props);
        this.node = null;
        this.state = {
            ...props
        };
    }
    componentDidMount() {
        this.props.callback(this);
        this.node = ReactDOM.findDOMNode(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.updateProps) {
            return nextProps;
        } else {
            return prevState;
        }
    }
    render() {
        return ( <
            a className = {
                this.state.styleClass
            }
            href = {
                this.state.hyperlink
            }
            onClick = {
                this.state.handleClick.bind(this)
            } > {
                this.state.data
            } <
            /a>
        );
    }
}
Anchor.defaultProps = {
    callback: () => null
    , updateProps: true
};
Anchor.propTypes = {
    callback: PropTypes.func
    , data: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    , handleClick: PropTypes.func.isRequired
    , hyperlink: PropTypes.string
    , styleClass: PropTypes.string.isRequired
    , updateProps: PropTypes.bool
};
export default Anchor;