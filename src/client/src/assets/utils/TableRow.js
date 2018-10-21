/**
 * FILENAME:    TableRow.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the TableRow class, a utility class for
 *  table row tags in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import TableCell from 'utils/TableCell';
import TableHeader from 'utils/TableHeader';

class TableRow extends React.Component {
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

    getTableCells() {
        var cells;
        var data = this.state.dataRow;
        var style = this.state.styleCell;

        if (this.state.isHeaderRow) {
            cells = data.map((cellData, index) =>
                React.createElement(TableHeader, {
                    "data": cellData,
                    "key": "key-cell-" + index,
                    "style": style
                })
            );
        } else {
            cells = data.map((cellData, index) =>
                React.createElement(TableCell, {
                    "data": cellData,
                    "key": "key-cell-" + index,
                    "style": (data) => style(data, index)
                })
            );
        }

        return cells;
    }

    render() {
        return (
            <tr className={ this.state.styleRow(this.state.index) }>
                { this.getTableCells() }
            </tr>
        );
    }
}

TableRow.propTypes = {
    dataRow: PropTypes.array.isRequired,
    isHeaderRow: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    styleCell: PropTypes.func.isRequired,
    styleRow: PropTypes.func.isRequired
}

export default TableRow;
