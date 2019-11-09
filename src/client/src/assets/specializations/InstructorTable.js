/**
 * FILENAME:    InstructorTable.js
 * AUTHOR:      Isaac Streight
 * START DATE:  December 2nd, 2018
 *
 * This file contains the InstructorTable class, a specialization class for
 *  the table for the Instructors section of the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import TableRow from 'utils/TableRow';
import AddRow from 'specializations/AddRow';
import RemoveRow from 'specializations/RemoveRow';
import PreferencesButton from 'specializations/PreferencesButton';
import PrivatesOnlyCheckbox from 'specializations/PrivatesOnlyCheckbox';

class InstructorTable extends React.Component {
    constructor(props) {
        super(props);

        this.rows = null;
        this.state = null;
        this.toggleTableState = null;
        this.preferencesButtons = null;
        this.privatesOnlyCheckboxes = null;
    }

    componentWillMount() {
        this.rows = [];
        this.preferencesButtons = [];
        this.privatesOnlyCheckboxes = [];
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
        var dateOfHire;
        var wsiExpiration;
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
                dateOfHire = input.state.value;
            } else if (inputIndex == 2) {
                wsiExpiration = input.state.value;
            }
        }

        this.state.addCallback({
            "instructor": name,
            "dateOfHire": dateOfHire,
            "privateOnly": false,
            "wsiExpiration": wsiExpiration
        }).then((res) => this.addNewInstructorRow(res));

        // Empty the inputs of the AddRow after adding the new row.
        for (var inputIndex = 0; inputIndex < addRowInputs.length; inputIndex++) {
            var input = addRowInputs[inputIndex];
            input.setState({ "value": "" });
        }

        this.resizeTable();
        this.recolourTable();
    }

    addNewInstructorRow(res) {
        var instructorData = res.data;
        var dataBody = this.state.dataBody;

        for (var instructorName in instructorData) {
            var instructor = instructorData[instructorName];

            dataBody.push([
                instructorName,
                instructor.dateOfHire,
                instructor.wsiExpiration,
                {
                    instructorId: instructor.id,
                    privateOnly: instructor.privateOnly
                }, {
                    instructorId: instructor.id,
                    instructorName: instructorName
                }
            ]);
        }

        this.setState(Object.assign(this.state, {
            "dataBody": dataBody
        }), () => this.toggleState(true));
    }

    /**
     * Check if the WSI certification date is expiring or expired.
     */
    checkWSIExpiration(expiryTime) {
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        expiryTime = Date.parse(expiryTime);

        if (expiryTime < Date.now()) {
            return "error-cell";
        } else if (expiryTime < Date.now() + sixtyDaysInMilliseconds) {
            return "warning-cell";
        }
    }

    getBodyRows() {
        var instructor;
        var instructorIds = [];
        var data = JSON.parse(JSON.stringify(this.state.dataBody));

        this.rows = [];

        // Replace checkbox and preference button data with the object.
        for (var index = 0; index < data.length; index++) {
            var checkboxObject;
            var prefsButtonObject;

            instructor = data[index];

            instructorIds.push(instructor[3].instructorId);
            checkboxObject = this.getPrivatesOnlyCheckbox(instructor[3], index);
            prefsButtonObject = this.getPreferencesButton(instructor[4], index);

            instructor.splice(3, 1, checkboxObject);
            instructor.splice(4, 1, prefsButtonObject);
        }

        data = this.sortBodyData(data);

        return data.map((dataRow, index) => {
            return React.createElement(RemoveRow, {
                "callback": (ref) => this.rows.push(ref),
                "dataRow": dataRow,
                "key": "key-row-" + index,
                "handleClick": this.remove.bind(this),
                "id": instructorIds[index],
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

    getPreferencesButton(prefConfig, keyIndex) {
        return [
            React.createElement(PreferencesButton, {
                "callback": (ref) => this.preferencesButtons.push(ref),
                "handleClick": () => null,
                "instructorId": prefConfig.instructorId,
                "instructorName": prefConfig.instructorName,
                "key": "key-instructor-pref-" + keyIndex
            })
        ];
    }

    getPrivatesOnlyCheckbox(privatesOnlyConfig, keyIndex) {
        return [
            React.createElement(PrivatesOnlyCheckbox, {
                "callback": (ref) => this.privatesOnlyCheckboxes.push(ref),
                "checked": privatesOnlyConfig.privateOnly,
                "handleChange": () => null,
                "instructorId": privatesOnlyConfig.instructorId,
                "key": "key-instructor-checkbox-" + keyIndex
            })
        ];
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

        // Remove preference button of removed instructor.
        this.preferencesButtons.forEach((prefButton, prefIndex) => {
            if (prefButton.state.instructorId === instructorId) {
                this.preferencesButtons.splice(prefIndex, 1);
            }
        });

        // Remove checkbox of removed instructor.
        this.privatesOnlyCheckboxes.forEach((privatesCheckbox, privIndex) => {
            if (privatesCheckbox.state.instructorId === instructorId) {
                this.privatesOnlyCheckboxes.splice(privIndex, 1);
            }
        });

        this.resizeTable();
        this.recolourTable();
    }

    resizeTable() {
        var newHeight;

        if (this.rows.length > 3) {
            newHeight = 512 + (40 * (this.rows.length - 3));
        } else {
            newHeight = 512;
        }

        dynamicInstructors.style.height = newHeight + "px";
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
        var instructorNames;
        var uniqueInstructors;
        var duplicateInstructors;
        var tableRows = this.state.dataBody;
        var reName = new RegExp(/^[A-Za-z\s]+$/);
        var tableHeaders = this.state.dataHeader;

        instructorNames = tableRows.map((element, _index) => element[0]);

        uniqueInstructors = new Set(instructorNames);
        duplicateInstructors = instructorNames.filter((instructor) => !uniqueInstructors.has(instructor));

        if (Array.isArray(cell)) {
            // Base style for buttons.
            style = "is-center";
        } else if (!reName.test(cell) && isNaN(Date.parse(cell))) {
            // Invalid input.
            style = "error-cell";
        } else if(duplicateInstructors.includes(cell)) {
            // Duplicate instructor name.
            style = "error-cell";
        } else if (tableHeaders[0][index] === "WSI Expiration") {
            // WSI expiration.
            style = this.checkWSIExpiration(cell);
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

        // TODO
        // Toggling the states of the checkbox and preference button indicate a memory leak.
        // I think this is how their references are stored and aren't updated with each new render.
        /*
        this.rows.forEach((row, rowIndex) => {
            var checkbox = this.privatesOnlyCheckboxes[rowIndex];
            var preferenceButton = this.preferencesButtons[rowIndex];

            checkbox.toggleState(enable);
            preferenceButton.toggleState(enable);
        });
        */

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

InstructorTable.defaultProps = {
    toggle: false
};

InstructorTable.propTypes = {
    addCallback: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
    dataBody: PropTypes.array.isRequired,
    dataHeader: PropTypes.array.isRequired,
    removeCallback: PropTypes.func.isRequired,
    sectionId: PropTypes.string,
    toggle: PropTypes.bool,
    updateCallback: PropTypes.func.isRequired
}

export default InstructorTable;
