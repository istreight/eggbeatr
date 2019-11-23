/**
 * FILENAME:    ListItem.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the ListItem class, a utility class for list item tags
 *  in the application.
 *
 * @format
 */
import React from "react";
import PropTypes from "prop-types";
class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props
        };
    }
    static getDerivedStateFromProps(nextProps) {
        return nextProps;
    }
    render() {
        return <li className = {
            this.state.styleClass
        } > {
            this.state.data
        } < /li>;
    }
}
ListItem.propTypes = {
    data: PropTypes.array.isRequired
    , styleClass: PropTypes.string.isRequired
};
export default ListItem;