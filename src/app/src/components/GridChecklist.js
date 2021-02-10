/**
 * FILENAME:    GridChecklist.js
 * AUTHOR:      Isaac Streight
 * START DATE:  September 14th, 2017
 *
 * This file contains the GridChecklist class, to display
 *  the requirements to create a lesson grid.
 */

import React from 'react';

import Table from '@utils/Table';


class GridChecklist extends React.Component {
    constructor(props) {
        super(props);

        this.componentRow = null;
        this.state = {
            "data": {
                "grid": {
                    "quantity": false,
                    "cell": ""
                },
                "instructors": {
                    "quantity": 0,
                    "cell": ""
                },
                "lessons": {
                    "quantity": 0,
                    "cell": ""
                },
                "privates":{
                    "quantity": 0,
                    "cell": ""
                }
            }
        };
    }

    /**
     * Store a reference to the button and the button's on click handler.
     */
    setCreateGridComponents(button, handler) {
        this.createGridButton = button;
        this.createGridHandler = handler;
    }

    /**
     * Set a new quantity for one of the components.
     */
    setQuantity(key, quantity) {
        Object.assign(this.state.data[key], { "quantity": quantity });

        this.checkComplete();
        this.setState(this.state);
    }

    /**
     * Check the quantities of the components to assess their validity.
     */
    checkComplete() {
        var isGridValid;
        var isLessonsValid;
        var isInstructorsValid;
        var disabledClass = " pure-button-disabled";
        var reReplaceCriteria = new RegExp(disabledClass, "g");
        var styleClass = this.createGridButton.state.styleClass;

        styleClass = styleClass.replace(reReplaceCriteria, "");

        for (let key in this.state.data) {
            let value = this.state.data[key];
            let isValid = (value.quantity > 0);

            if (key === "instructors") {
                Object.assign(value, { "cell": isValid ? null : "error-cell" });

                isInstructorsValid = isValid;
            } else if (key === "lessons") {
                let privatesQuantity = this.state.data.privates.quantity;
                let errorClass = (privatesQuantity > 0) ? "warning-cell" : "error-cell";

                Object.assign(value, { "cell": isValid ? "" : errorClass });

                isLessonsValid = isValid || privatesQuantity > 0;
            } else if (key === "grid") {
                isGridValid = value.quantity;
            }
        }

        // Verify condition to enable/disable "Create Grid" button.
        if (isLessonsValid && isInstructorsValid && isGridValid) {
            this.createGridButton.setState({
                "handleClick": this.createGridHandler,
                "styleClass": styleClass
            });
        } else {
            this.createGridButton.setState({
                "handleClick": () => null,
                "styleClass": styleClass.concat(disabledClass)
            });
        }
    }

    /**
     * Style the component's cell based on it's quantity.
     */
    getCellStyle(value) {
        var isValid;
        var cellClass = null;
        var quantity = parseInt(value, 10);

        if (isNaN(quantity)) {
            this.componentRow = value;

            return;
        }

        isValid = (quantity > 0);
        if (this.componentRow === "Instructors") {
            cellClass = isValid ? null : "error-cell";
        } else if (this.componentRow === "Lessons") {
            let errorClass = (this.state.data.privates.quantity > 0) ? "warning-cell" : "error-cell";

            cellClass = isValid ? "" : errorClass;
        }

        return cellClass;
    }

    render() {
        return (
            <div>
                <h3 className="content-head">Grid Checklist</h3>
                <Table
                    dataBody={ [
                        ["Instructors", this.state.data.instructors.quantity.toString()],
                        ["Lessons", this.state.data.lessons.quantity.toString()],
                        ["Privates", this.state.data.privates.quantity.toString()]
                    ] }
                    dataHeader={ [[
                        "Requirements",
                        "Quantity"
                    ]] }
                    styleCell={ this.getCellStyle.bind(this) }
                    styleRow={ (index) => index % 2 ? "table-even" : "table-odd" }
                    styleTable={ "pure-table" }
                />
            </div>
        );
    }
}

export default GridChecklist;
