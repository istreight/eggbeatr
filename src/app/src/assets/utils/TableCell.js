/**
 * FILENAME:    TableCell.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the TableCell class, a utility class for
 *  table cell tags in the application.
 *
 * @format
 */
import React from "react";
import PropTypes from "prop-types";
class TableCell extends React.Component {
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
        return ( <
            td className = {
                this.state.style(this.state.data)
            } > {
                this.state.data
            } < /td>
        );
    }
}
TableCell.propTypes = {
    data: PropTypes.oneOfType(
        [PropTypes.array, PropTypes.number, PropTypes.string]
    )
    , style: PropTypes.func.isRequired
};
export default TableCell;