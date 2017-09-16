/**
 * FILENAME:    GridChecklist.js
 * AUTHOR:      Isaac Streight
 * START DATE:  September 14th, 2017
 *
 * This file contains the GridChecklist class, to display the requirements
 * to create a lesson grid.
 */

import React from 'react';
import ReactDOM from 'react-dom';

class GridChecklist extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Store the "Create Grid" function locally to re-apply when components are complete.
        this.createGridHandler = jQuery._data($("#create-grid")[0], "events").click[0].handler;

        // Unbind "Create Grid" button.
        $("#create-grid").unbind("click");
    }

    checkComplete(selector, value) {
        var selectorChildren = selector.children();

        if (selectorChildren.length > 0) {
            var createGridButton = $("#create-grid");
            var numLessonsCell = $("#lessons-checklist").children()[1];
            var numPrivateCell = $("#private-checklist").children()[1];
            var numInstructorsCell = $("#instructors-checklist").children()[1];

            // Update selector content.
            $(selectorChildren[1]).html(value);
            $(selectorChildren[1]).removeClass("error-table");

            // Place warning if quantity of lessons is 0 and quantity of privates is greater than 0.
            if ($(numLessonsCell).hasClass("error-table")) {
                if ($(numPrivateCell).html() === "0") {
                    $(numLessonsCell).removeClass("warning-table").addClass("error-table");
                } else {
                    $(numLessonsCell).removeClass("error-table").addClass("warning-table");
                }
            }

            if ($(numLessonsCell).html() !== "0") {
                $(numLessonsCell).removeClass("warning-table");
            }

            // Verify others.
            if ($(numInstructorsCell).html() !== "0" && ($(numLessonsCell).html() !== "0" || $(numPrivateCell).html() !== "0")) {
                // Bind button, if complete.
                createGridButton.removeClass("pure-button-disabled");
                createGridButton.unbind("click").click(this.createGridHandler);
            } else {
                createGridButton.unbind("click");
            }
        }
    }

    render() {
        return (
            <div id="grid-checklist">
                <h3 id="grid-checklist-title" className="content-head">Grid Checklist</h3>
                <table id="grid-checklist-table" className="pure-table">
                    <thead>
                        <tr>
                            <th>
                                Requirements
                            </th>
                            <th>
                                Quantity
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-odd" id="instructors-checklist">
                            <td>
                                Instructors
                            </td>
                            <td className="error-table">
                                0
                            </td>
                        </tr>
                        <tr className="table-even" id="lessons-checklist">
                            <td>
                                Lessons
                            </td>
                            <td className="error-table">
                                0
                            </td>
                        </tr>
                        <tr className="table-odd" id="private-checklist">
                            <td>
                                Privates
                            </td>
                            <td>
                                0
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

function exportComponent() {
    return {
        renderComponent: () => {
            return ReactDOM.render(<GridChecklist/>, document.getElementById('dynamicGridChecklist'));
        }
    };
}

export default exportComponent;
