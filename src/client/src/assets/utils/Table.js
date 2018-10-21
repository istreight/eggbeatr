/**
 * FILENAME:    Table.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the Table class, a utility class for
 *  table tags in the application.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import TableRow from 'utils/TableRow';

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    getBodyRows() {
        var data = this.state.dataBody();

        return data.map((dataRow, index) =>
            React.createElement(TableRow, {
                "dataRow": dataRow,
                "isHeaderRow": false,
                "index": index,
                "key": "key-row-" + index,
                "styleCell": this.state.styleCell,
                "styleRow": this.state.styleRow
            })
        );
    }

    getHeaderRows() {
        var data = this.state.dataHeader();

        return data.map((dataRow, index) =>
            React.createElement(TableRow, {
                "dataRow": dataRow,
                "isHeaderRow": true,
                "index": index,
                "key": "key-header-" + index,
                "styleCell": this.state.styleHeader,
                "styleRow": () => null
            })
        );
    }

    render() {
        return (
            <table className={ this.state.styleTable() }>
                <thead>
                    { this.getHeaderRows() }
                </thead>
                <tbody>
                    { this.getBodyRows() }
                </tbody>
            </table>
        );
    }
}

Table.propTypes = {
    callback: PropTypes.func.isRequired,
    dataBody: PropTypes.func.isRequired,
    dataHeader: PropTypes.func.isRequired,
    styleCell: PropTypes.func.isRequired,
    styleHeader: PropTypes.func.isRequired,
    styleRow: PropTypes.func.isRequired,
    styleTable: PropTypes.func.isRequired
}

export default Table;
