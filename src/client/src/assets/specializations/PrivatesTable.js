/**
 * FILENAME:    PrivatesTable.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 10th, 2018
 *
 * This file contains the PrivatesTable class, a specialization class for
 *  the table for the Privates section of the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import TableRow from 'utils/TableRow';
import AddRow from 'specializations/AddRow';
import RemoveRow from 'specializations/RemoveRow';

class PrivatesTable extends React.Component {
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
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    add() {
        var name;
        var time;
        var duration;
        var addRowInputs = this.addRow.inputs;

        if (addRowInputs.length != 3) {
            this.state.addCallback({});

            return;
        }

        for (var inputIndex = 0; inputIndex < addRowInputs.length; inputIndex++) {
            var input = addRowInputs[inputIndex];

            if (inputIndex == 0) {
                name = input.state.value;
            } else if (inputIndex == 1) {
                time = input.state.value;
            } else if (inputIndex == 2) {
                duration = input.state.value;
            }
        }

        this.state.addCallback({
            "duration": duration,
            "instructor": name,
            "time": time
        }).then((res) => this.addNewPrivateLessonRow(res));

        // Empty the inputs of the AddRow after adding the new row.
        for (var inputIndex = 0; inputIndex < addRowInputs.length; inputIndex++) {
            var input = addRowInputs[inputIndex];
            input.setState({ "value": "" });
        }

        this.resizeTable();
        this.recolourTable();
    }

    addNewPrivateLessonRow(res) {
        this.setState(this.state, () => this.toggleState(true));
    }

    getBodyRows() {
        var privateLesson;
        var lessonIds = [];
        var data = JSON.parse(JSON.stringify(this.state.dataBody));

        this.rows = [];

        // Replace checkbox and preference button data with the object.
        for (var index = 0; index < data.length; index++) {
            privateLesson = data[index];

            lessonIds.push(privateLesson[0]);

            data[index] = privateLesson.slice(1);
        }

        data = this.sortBodyData(data);

        return data.map((dataRow, index) => {
            return React.createElement(RemoveRow, {
                "callback": (ref) => this.rows.push(ref),
                "dataRow": dataRow,
                "key": "key-row-" + index,
                "handleClick": this.remove.bind(this),
                "id": lessonIds[index],
                "index": index,
                "show": this.state.toggle,
                "styleCell": this.styleCell.bind(this),
                "styleRow": () => this.styleRow(index),
                "updateCallback": this.state.updateCallback
            });
        });
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
        var dynamicPrivates = document.getElementById("dynamicPrivate");

        oldHeight = dynamicPrivates.style.height;
        oldHeight = parseInt(oldHeight.substring(0, oldHeight.indexOf("px")));

        if (this.rows.length > 3) {
            newHeight = 512 + (40 * (this.rows.length - 3));
        } else {
            newHeight = 512;
        }

        if (newHeight > oldHeight) {
            dynamicPrivates.style.height = newHeight + "px";
        }
    }

    sortBodyData(bodyData) {
        return bodyData.sort((current, next) => {
            if (current[0] < next[0]) {
                return -1;
            } else if (current[0] > next[0]) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    styleCell(cell, index) {
        var style;
        var isValidData;
        var instructorNames;
        var uniqueInstructors;
        var duplicateInstructors;
        var tableRows = this.state.dataBody;

        if (Array.isArray(cell)) {
            // Base style for buttons.
            return "is-center";
        }

        instructorNames = tableRows.map((element, index) => element[0]);

        uniqueInstructors = new Set(instructorNames);
        duplicateInstructors = instructorNames.filter((instructor) => !uniqueInstructors.has(instructor));

        if (index === 0) {
            var reName = new RegExp(/^[A-Za-z\s]+$/);

            isValidData = reName.test(cell);
        } else if (index === 1) {
            var [hour, minute] = cell.split(":");
            var reHour = new RegExp(/^0?[0-9]|1[0-2]$/);
            var reMinute = new RegExp(/^([0-5][05]|60)$/);

            isValidData = reHour.test(hour) && reMinute.test(minute);
        } else if (index === 2) {
            var duration = parseInt(cell, 10) % 60;
            var reDuration = new RegExp(/^([0-5][05]|60)$/);

            isValidData = reDuration.test(duration);
        }

        if (!isValidData) {
            // Invalid input.
            style = "error-cell";
        } else if (duplicateInstructors.includes(cell)) {
            // Duplicate instructor name.
            style = "error-cell";
        }

        return style;
    }

    styleRow(index) {
        if (index % 2 === 0) {
            return "table-odd";
        } else {
            return "table-even"
        }
    }

    // Give this to the Edit Instructors button.
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
                        componentType={ "Privates" }
                        handleClick={ this.add.bind(this) }
                        index={ this.state.dataBody.length }
                        styleCell={ this.styleCell.bind(this) }
                        styleRow={ this.styleRow.bind(this) }
                    />
                </tbody>
            </table>
        );
    }
}

PrivatesTable.defaultProps = {
    toggle: false
};

PrivatesTable.propTypes = {
    addCallback: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
    dataBody: PropTypes.array.isRequired,
    dataHeader: PropTypes.array.isRequired,
    removeCallback: PropTypes.func.isRequired,
    sectionId: PropTypes.string,
    toggle: PropTypes.bool,
    updateCallback: PropTypes.func.isRequired
}

export default PrivatesTable;
