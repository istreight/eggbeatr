/**
 * FILENAME:    TableCell.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the TableCell class, a utility class for
 *  table cell tags in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class TableCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    render() {
        return (
            <td className={ this.state.style(this.state.data) }>
                { this.state.data }
            </td>
        );
    }
}

TableCell.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]),
    style: PropTypes.func.isRequired
}

export default TableCell;
