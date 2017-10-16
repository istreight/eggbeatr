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
    componentDidMount() {
        // Store the "Create Grid" function locally to re-apply when components are complete.
        this.createGridHandler = jQuery._data($("#create-grid")[0], "events").click[0].handler;

        // Unbind "Create Grid" button.
        $("#create-grid").unbind("click");
    }

    checkComplete(selector, value) {
        var selectorChild = selector.children()[1];

        if ($(selectorChild).length > 0) {
            var createGridButton = $("#create-grid");
            var numLessonsCell = $("#lessons-checklist").children()[1];
            var numPrivateCell = $("#private-checklist").children()[1];
            var numInstructorsCell = $("#instructors-checklist").children()[1];

            // Update selector content.
            $(selectorChild).html(value);

            if (value !== 0) {
                $(selectorChild).removeClass("error-table");
            } else if (selector.attr("id") !== "private-checklist") {
                $(selectorChild).addClass("error-table");
            }

            // Place warning if quantity of lessons is 0 and quantity of privates is not 0.
            if ($(numLessonsCell).html() === "0") {
                if ($(numPrivateCell).html() === "0") {
                    $(numLessonsCell).removeClass("warning-table").addClass("error-table");
                } else {
                    $(numLessonsCell).removeClass("error-table").addClass("warning-table");
                }
            } else {
                $(numLessonsCell).removeClass("warning-table");
            }

            // Verify condition to enable/disable "Create Grid" button.
            if ($(numInstructorsCell).html() !== "0" && ($(numLessonsCell).html() !== "0" || $(numPrivateCell).html() !== "0")) {
                createGridButton.removeClass("pure-button-disabled");
                createGridButton.unbind("click").click(this.createGridHandler);
            } else {
                createGridButton.addClass("pure-button-disabled");
                createGridButton.unbind("click");
            }
        }
    }

    render() {
        return (
            <div id="grid-checklist">
                <h3 className="content-head">Grid Checklist</h3>
                <table className="pure-table">
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
                        <tr id="instructors-checklist" className="table-odd">
                            <td>
                                Instructors
                            </td>
                            <td className="error-table">
                                0
                            </td>
                        </tr>
                        <tr id="lessons-checklist" className="table-even">
                            <td>
                                Lessons
                            </td>
                            <td className="error-table">
                                0
                            </td>
                        </tr>
                        <tr id="private-checklist" className="table-odd">
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
