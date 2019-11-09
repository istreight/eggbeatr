/**
 * FILENAME:    RemoveRow.js
 * AUTHOR:      Isaac Streight
 * START DATE:  December 3rd, 2018
 *
 * This file contains the RemoveRow class, a specialization class for
 *  table row tags whith have a 'Remove' button in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input from 'utils/Input';
import TableRow from 'utils/TableRow';
import RemoveButton from 'specializations/RemoveButton';

class RemoveRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.inputs = null;
    }

    componentWillMount() {
        this.inputs = [];
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.updateProps) {
            this.setState(nextProps);
        }

        this.props.callback(this);
    }

    handleClick() {
        this.state.handleClick(this.state.id);
    }

    toggleState(enable) {
        var input;
        var newData;
        var prevName;
        var placeholder;
        var instructorName;
        var newDataRow = [];
        var isUpdated = false;
        var updatedInstructor = {};
        var dataRow = this.state.dataRow;

        dataRow.forEach((cellData, cellIndex) => {
            if (cellIndex > 2) {
                newDataRow.push(cellData);
                return;
            }

            if (enable) {
                // Text to input.
                if (typeof cellData === "string") {
                    placeholder = cellData;

                    newData = React.createElement(Input, {
                        "callback": (ref)=> {
                            this.inputs[cellIndex] = ref;
                        },
                        "handleBlur": () => null,
                        "key": "key-removerow-" + this.state.index + "-input-" + cellIndex,
                        "placeholder": placeholder,
                        "styleClass": "",
                        "type": "text",
                        "value": ""
                    });

                    newData = [newData];
                } else {
                    newData = cellData;
                }
            } else {
                // Input to text.
                if (this.inputs.length > 0) {
                    input = this.inputs[cellIndex];

                    // Capture placeholder instructor name.
                    if (cellIndex === 0) {
                        prevName = input.state.placeholder;
                    }

                    isUpdated = isUpdated || input.state.value !== "";
                    newData = input.state.value || input.state.placeholder;
                } else {
                    // First display case.
                    newData = cellData;
                }
            }

            newDataRow.push(newData);
        });

        // Append or remove the Remove button from the row.
        if (enable) {
            var removeButton = React.createElement(RemoveButton, {
                "callback": () => null,
                "handleClick": this.handleClick.bind(this),
                "key": "key-removerow-removebutton-0"
            });

            newDataRow.push([removeButton]);
        } else if (newDataRow.length === 6) {
            newDataRow.splice(-1, 1);
        }

        if (isUpdated) {
            // Package data and update in Instructors component.
            instructorName = newDataRow[0];
            updatedInstructor = {
                "dateOfHire": newDataRow[1],
                "wsiExpiration": newDataRow[2]
            };

            this.state.updateCallback(prevName, updatedInstructor, instructorName);
        }

        return newDataRow;
    }

    render() {
        return (
            <TableRow
                callback={ () => null }
                dataRow={ this.toggleState(this.state.show) }
                isHeaderRow={ false }
                index={ this.state.index }
                styleCell={ this.state.styleCell }
                styleRow={ this.state.styleRow }
            />
        );
    }
}

RemoveRow.defaultProps = {
    show: false,
    updateProps: true
};

RemoveRow.propTypes = {
    callback: PropTypes.func,
    dataRow: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    show: PropTypes.bool,
    styleCell: PropTypes.func.isRequired,
    styleRow: PropTypes.func.isRequired,
    updateCallback: PropTypes.func.isRequired
}

export default RemoveRow;
