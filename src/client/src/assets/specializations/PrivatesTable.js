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

import ToggleTable from 'specializations/ToggleTable';

import TableRow from 'utils/TableRow';
import AddRow from 'specializations/AddRow';
import RemoveRow from 'specializations/RemoveRow';

class PrivatesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.toggleTable = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        return;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    add(inputValues) {
        return this.state.addCallback({
            "duration": inputValues[2],
            "instructor": inputValues[0],
            "time": inputValues[1]
        });
    }

    getAdditionalRowData() {
        return;
    }

    remove(instructorId) {
        this.state.removeCallback(instructorId);
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

    toggleState(enable) {
        this.toggleTable.toggleState(enable);
    }

    /**
     * Set the reference to subcomponent references.
     */
    setComponentReference(name, reference) {
        this[name] = reference;
    }

    render() {
        return (
            <ToggleTable
                addCallback={ this.add.bind(this) }
                callback={ (ref) => {
                    this.setComponentReference("toggleTable", ref);
                    this.state.callback(ref);
                } }
                componentType={ "Privates" }
                dataBody={ this.state.dataBody }
                dataHeader={ this.state.dataHeader }
                getAdditionalRowData={ this.getAdditionalRowData.bind(this) }
                removeCallback={ this.remove.bind(this) }
                sectionId={ this.state.sectionId }
                updateCallback={ this.state.updateCallback }
                styleCell={ this.styleCell.bind(this) }
            />
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
