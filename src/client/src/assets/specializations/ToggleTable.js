/**
 * FILENAME:    ToggleTable.js
 * AUTHOR:      Isaac Streight
 * START DATE:  november 13th, 2019
 *
 * This file contains the ToggleTable class, a specialization class for
 *  the tables with View/Edit states.
 */

import React from 'react';
import PropTypes from 'prop-types';

import TableRow from 'utils/TableRow';
import AddRow from 'specializations/AddRow';
import RemoveRow from 'specializations/RemoveRow';

class ToggleTable extends React.Component {
    constructor(props) {
        super(props);

        this.rows = null;
        this.state = null;
        this.toggleTableState = null;
    }

    componentWillMount() {
        this.rows = [];

        this.toggleTableState = this.toggleState.bind(this);
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);

        this.resizeTable();
        this.recolourTable();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    add() {
        var inputValues = [];
        var addRowInputs = this.addRow.inputs;

        if (addRowInputs.length != 3) {
            this.state.addCallback({});

            return;
        }

        for (var inputIndex = 0; inputIndex < addRowInputs.length; inputIndex++) {
            var input = addRowInputs[inputIndex];

            inputValues.push(input.state.value);
        }

       this.state.addCallback(inputValues).then(() => this.addNewRow());

        // Empty the inputs of the AddRow after adding the new row.
        for (var inputIndex = 0; inputIndex < addRowInputs.length; inputIndex++) {
            var input = addRowInputs[inputIndex];
            input.setState({ "value": "" });
        }

        this.resizeTable();
        this.recolourTable();
    }

    addNewRow() {
        this.setState(this.state, () => this.toggleState(true));
    }

    getBodyRows() {
        var dataRow;
        var ids = [];
        var data = JSON.parse(JSON.stringify(this.state.dataBody));

        this.rows = [];

        // Replace checkbox and preference button data with the object.
        for (var index = 0; index < data.length; index++) {
            dataRow = data[index];

            ids.push(dataRow[0]);

            this.state.getAdditionalRowData(dataRow, index);

            data[index] = dataRow.slice(1);
        }

        data = this.sortBodyData(data);

        return data.map((dataRow, index) =>
            React.createElement(RemoveRow, {
                "callback": (ref) => this.rows.push(ref),
                "dataRow": dataRow,
                "key": "key-row-" + index,
                "handleClick": this.remove.bind(this),
                "id": ids[index],
                "index": index,
                "show": this.state.toggle,
                "styleCell": this.state.styleCell,
                "styleRow": () => this.styleRow(index),
                "updateCallback": this.state.updateCallback
            })
        );
    }

    getHeaderRows() {
        var data = this.state.dataHeader;

        return data.map((dataRow, index) =>
            React.createElement(TableRow, {
                "callback": () => null,
                "dataRow": dataRow,
                "isHeaderRow": true,
                "index": index,
                "key": "key-header-" + index,
                "styleCell": () => "is-center",
                "styleRow": () => null
            })
        );
    }

    recolourTable() {
        //Colour table rows.
        this.rows.forEach((row, index) => {
            row.setState({
                "styleRow": () => this.styleRow(index)
            });
        });

        // Colour AddRow.
        this.addRow.setState({
            "styleRow": () => this.styleRow(this.rows.length)
        });
    }

    remove(instructorId) {
        this.state.removeCallback(instructorId);

        this.resizeTable();
        this.recolourTable();
    }

    resizeTable() {
        var oldHeight;
        var newHeight;
        var dynamicInstructors = document.getElementById(this.state.sectionId);

        oldHeight = dynamicInstructors.offsetHeight;

        if (this.rows.length > 3) {
            newHeight = 512 + (40 * this.rows.length);
        } else {
            newHeight = 512;
        }

        if (newHeight > oldHeight) {
            dynamicInstructors.style.height = newHeight + "px";
        }
    }

    sortBodyData(bodyData) {
        return bodyData.sort((current, next) => {
            if (current[0] == next[0]) {
                return -1;
            } else {
                return current[0] > next[0];
            }
        });
    }

    styleRow(index) {
        if (index % 2 === 0) {
            return "table-odd";
        } else {
            return "table-even"
        }
    }

    toggleState(enable) {
        var headerRows = this.state.dataHeader[0];

        if (headerRows.includes("Modify")) {
            headerRows.splice(headerRows.indexOf("Modify"), 1);
        }

        if (enable) {
            this.setState({
                "dataHeader": [headerRows.concat("Modify")]
            });
        } else {
            this.setState({
                "dataHeader": [headerRows]
            });
        }

        this.addRow.toggleState(enable);

        this.setState({
            "toggle": enable
        });

        this.resizeTable();
        this.recolourTable();
    }

    /**
     * Set the reference to subcomponent references.
     */
    setComponentReference(name, reference) {
        this[name] = reference;
    }

    render() {
        return (
            <table className="pure-table">
                <thead>
                    { this.getHeaderRows() }
                </thead>
                <tbody>
                    { this.getBodyRows() }
                    <AddRow
                        callback={ (ref) => this.setComponentReference("addRow", ref) }
                        componentType={ this.state.componentType }
                        handleClick={ this.add.bind(this) }
                        index={ this.state.dataBody.length }
                        styleCell={ this.state.styleCell }
                        styleRow={ this.styleRow.bind(this) }
                    />
                </tbody>
            </table>
        );
    }
}

ToggleTable.defaultProps = {
    toggle: false
};

ToggleTable.propTypes = {
    addCallback: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
    dataBody: PropTypes.array.isRequired,
    dataHeader: PropTypes.array.isRequired,
    getAdditionalRowData: PropTypes.func.isRequired,
    removeCallback: PropTypes.func.isRequired,
    sectionId: PropTypes.string,
    toggle: PropTypes.bool,
    updateCallback: PropTypes.func.isRequired,
    styleCell: PropTypes.func.isRequired
}

export default ToggleTable;
