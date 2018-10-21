/**
 * FILENAME:    GridChecklist.js
 * AUTHOR:      Isaac Streight
 * START DATE:  September 14th, 2017
 *
 * This file contains the GridChecklist class, to display
 *  the requirements to create a lesson grid.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Table from 'utils/Table';


class GridChecklist extends React.Component {
    constructor(props) {
        super(props);

        this.checklistQuantities = {
            "instructors": 0,
            "lessons": 0,
            "privates": 0
        };
    }

    componentDidMount() {
        // Unbind "Create Grid" button.
        $("#dynamicGrid .content-section-description a").unbind("click");
    }

    setQuantity(key, value) {
        this.checklistQuantities[key] = value;

        this.checkComplete(key);
    }

    checkComplete(key) {
        var isLessonsValid;
        var isInstructorsValid;
        var gridChecklist = $("#dynamicGridChecklist td");

        gridChecklist.each((index, element) => {
            var key = $(element).html().toLowerCase();

            if (key in this.checklistQuantities) {
                var isValid;
                var valueCell = $(element).next();
                var value = this.checklistQuantities[key];

                if (key === "instructors") {
                    isInstructorsValid = (value !== 0);
                } else if (key === "lessons") {
                    isLessonsValid = (value !== 0) || isLessonsValid;
                } else if (key === "privates") {
                    isLessonsValid = (value !== 0) || isLessonsValid;
                }

                isValid = isLessonsValid && isInstructorsValid;

                this.updateGridChecklist(key, value, valueCell, isValid);
            }
        });
    }

    updateGridChecklist(key, value, valueCell, isValid) {
        var createGridButton = $("#dynamicGrid .content-section-description a");

        createGridButton.unbind("click");

        valueCell.html(value);

        if (value !== 0) {
            valueCell.removeClass("error-cell warning-table");
        } else if (key !== "privates") {
            valueCell.addClass("error-cell");
        }

        // Place warning if quantity of lessons is 0 and quantity of privates is not 0.
        if (key === "lessons" && value === 0) {
            if (this.checklistQuantities.privates !== 0) {
                valueCell.removeClass("error-cell").addClass("warning-table");
            } else {
                valueCell.removeClass("warning-table").addClass("error-cell");
            }
        }

        // Verify condition to enable/disable "Create Grid" button.
        if (isValid) {
            createGridButton.removeClass("pure-button-disabled");
            createGridButton.click(this.props.createGridHandler);
        } else {
            createGridButton.addClass("pure-button-disabled");
        }
    }

    render() {
        return (
            <div>
                <h3 className="content-head">Grid Checklist</h3>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th className="is-center">Requirements</th>
                            <th className="is-center">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-odd">
                            <td>Instructors</td>
                            <td>0</td>
                        </tr>
                        <tr className="table-even">
                            <td>Lessons</td>
                            <td>0</td>
                        </tr>
                        <tr className="table-odd">
                            <td>Privates</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

GridChecklist.propTypes =  {
    createGridHandler: PropTypes.func.isRequired
}

export default GridChecklist;
