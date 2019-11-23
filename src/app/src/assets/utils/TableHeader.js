/**
 * FILENAME:    TableHeader.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the TableHeader class, a utility class for
 *  table header cell tags in the application.
 *
 * @format
 */
import React from "react";
import PropTypes from "prop-types";
class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props
        };
    }
    render() {
        return <th > {
            this.state.data
        } < /th>;
    }
}
TableHeader.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};
export default TableHeader;