/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for
 *  the collection of instructors for the lesson
 *  calendar web application.
 * The Instructors class is exported.
 */

import React from 'react';

class InstructorPreferences extends React.Component {
    constructor(props) {
        super(props);

        this.preferences = {};
        this.defaultPreferences = [
            "Starfish", "Duck", "Sea Turtle",
            "Sea Otter", "Salamander", "Sunfish", "Crocodile", "Whale",
            "Level 1", "Level 2", "Level 3", "Level 4", "Level 5",
            "Level 6", "Level 7", "Level 8", "Level 9", "Level 10",
            "Basics I", "Basics II", "Strokes"
        ];
    }

    componentDidMount() {
        this.preferences = this.props.initData;

        $("#dynamicInstructorPreferences .modal-footer a").click(this.editPreferences.bind(this));

        // Hide modal on click outside of modal.
        $(window).click(() => {
            if (event.target === $("#dynamicInstructorPreferences div")[0]) {
                $("#dynamicInstructorPreferences div").css({
                    "display": "none"
                });
            }
        });
    }

    setPreferencesButtons(enable) {
        var preferenceButtons = $("#dynamicInstructors .preferences");

        if (enable) {
            preferenceButtons.click(this.displayPreferenceModal.bind(this));
            preferenceButtons.removeClass("pure-button-disabled");
        } else {
            preferenceButtons.unbind("click");
            preferenceButtons.addClass("pure-button-disabled");
        }
    }

    /**
     * Displays preference modal.
     */
    displayPreferenceModal() {
        $("#dynamicInstructorPreferences div").css({
            "display": "block"
        });

        var instructor = $(event.target).closest("tr").find("td").eq(0).html();
        $("#dynamicInstructorPreferences .modal-header").html(instructor);
        $("#dynamicInstructorPreferences .modal-body p").html("The following table outlines " + instructor + "'s level preferences.");

        this.levelPreferences(instructor);
    }

    /**
     * Generates the list of all lesson types in
     *  the Preferences table.
     */
    levelPreferences(instructor) {
        var preferences;

        if (instructor in this.preferences) {
            preferences = this.preferences[instructor].lessons;
        } else {
            preferences = JSON.parse(JSON.stringify(this.defaultPreferences));
        }

        // Create HTML table from the Preferences object.
        var newTable = "";
        for (var row = 0; row < 5; row++) {
            var rowClass = (row % 2 === 0) ? "table-odd" : "table-even";

            newTable += "<tr class='" + rowClass + "'>";

            for (var col = 0; col < 5; col++) {
                var className = "is-left ";
                var lessonIndex =
                      3 * Math.min(1, col)
                    + 5 * Math.max(0, (col - 1))
                    + ((col === 0 && row > 2 ? -1 : row));
                var lessonType = this.defaultPreferences[lessonIndex] || "";

                if (!(preferences.includes(lessonType))) {
                    className += (row % 2 === 0) ? "remove-preference-odd" : "remove-preference-even";
                }

                newTable += "<td class='" + className + "'>" + lessonType + "</td>";
            }

            newTable += "</tr>";
        }

        $("#dynamicInstructorPreferences .modal table tbody").html(newTable);
    }

    /**
     * Sets the state of the Preferences table to
     *  allow removal of cells.
     */
    editPreferences() {
        var lessonCells = $("#dynamicInstructorPreferences .modal td").filter((cell) => {
            return cell < 15 || (cell % 5 !== 0 && cell % 5 !== 4);
        });

        // Place 'add-preference' or 'remove-preference' buttons in each table cell, depending on text.
        lessonCells.each((index, element) => {
            if ($(element).is(".remove-preference-odd") || $(element).is(".remove-preference-even")) {
                $(element).append("<span class='add-preference'>&#10003;</span>");
            } else {
                $(element).append("<span class='remove-preference'>×</span>");

            }
        });

        // Bind removal and re-adding buttons.
        $("#dynamicInstructorPreferences .modal table .remove-preference").click(() => {
            this.togglePreferenceCell(true);
        });
        $("#dynamicInstructorPreferences .modal table .add-preference").unbind("click").click(() => {
            this.togglePreferenceCell(false);
        });

        var editButton = $("#dynamicInstructorPreferences .modal-footer a");
        editButton.unbind("click");
        editButton.html("Finish Editing");
        editButton.click(this.finishEditingPreferences.bind(this));
    }

    /**
     * Toggles contents to the cell in the Preferences
     *  table and appends 'remove-preference' or
     * 'add-preference' span.
     */
    togglePreferenceCell(remove) {
        var className;
        var name = $("#dynamicInstructorPreferences .modal-header").html();
        var row = $(event.target).closest("tr");
        var cell = $(event.target).closest("td");
        var cellIndex = row.children().index(cell);
        var rowIndex = $("#dynamicInstructorPreferences .modal-body tr").index(row) - 1;

        if (row.hasClass("table-odd")) {
            className = "remove-preference-odd";
        } else if (row.hasClass("table-even")) {
            className = "remove-preference-even";
        }

        $(event.target).remove();

        var lesson = cell.html();
        var preferences = this.preferences[name].lessons;
        var index = preferences.indexOf(lesson);
        if (remove) {
            if (index > -1) {
                preferences.splice(index, 1);
            }

            cell.addClass(className);
            cell.append("<span class='add-preference'>&#10003;</span>");

            // Rebind each 'add-preference' to their new cell.
            $("#dynamicInstructorPreferences .modal .add-preference").unbind("click").click(() => {
                this.togglePreferenceCell(false);
            });
        } else {
            if (index === -1) {
                preferences.push(lesson);
            }

            cell.removeClass(className);
            cell.append("<span class='remove-preference'>×</span>");

            // Rebind each 'remove-preference' to react to their new cell.
            $("#dynamicInstructorPreferences .modal .remove-preference").unbind("click").click(() => {
                this.togglePreferenceCell(true);
            });
        }
    }

    /**
     * Removes the 'remove-preference' and 'add-preference'
     *  spans from the Preferences table .
     */
    finishEditingPreferences() {
        // Key in preferences to add updated value.
        var name = $("#dynamicInstructorPreferences .modal-header").html();

        // Remove 'add-preference' or 'remove-preference' buttons.
        $("#dynamicInstructorPreferences .modal span").remove();

        var editButton = $("#dynamicInstructorPreferences .modal-footer a");
        editButton.html("Edit");
        editButton.unbind("click");
        editButton.click(this.editPreferences.bind(this));

        this.props.callback(this.preferences, "instructorPreferences", true);
    }

    render() {
        return (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header"></div>
                        <div className="modal-body">
                            <p></p>
                            <table className="pure-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Parent & Tot
                                        </th>
                                        <th>
                                            Pre-School
                                        </th>
                                        <th>
                                            Swim Kids
                                        </th>
                                        <th>
                                            Swim Kids
                                        </th>
                                        <th>
                                            Teens & Adults
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <a className="pure-button">Edit</a>
                        </div>
                    </div>
                </div>
        );
    }
}

InstructorPreferences.propTypes =  {
    callback: React.PropTypes.func.isRequired,
    initData: React.PropTypes.object.isRequired,
    connector: React.PropTypes.object.isRequired
}

export default InstructorPreferences;
