/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for the collection of instructors for
 * the lesson calendar web application. The Instructors class is exported.
 */

import React from 'react';

class InstructorPreferences extends React.Component {
    constructor(props) {
        super(props);

        this.preferences = {};
        this.defaultPreferences = [
            ["Starfish", "Duck", "Sea Turtle"],
            ["Sea Otter", "Salamander", "Sunfish", "Crocodile", "Whale"],
            ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"],
            ["Level 6", "Level 7", "Level 8", "Level 9", "Level 10"],
            ["Basics I", "Basics II", "Strokes"]
        ];
    }

    componentDidMount() {
        var sessionPreference = sessionStorage.getItem("instructorPreferences");
        if (sessionPreference && sessionPreference !== "{}") {
            this.preferences = JSON.parse(sessionPreference);
        }

        $(".modal-footer a").click(this.editPreferences.bind(this));

        // Hide modal on click outside of modal.
        $(window).click(() => {
            if (event.target === $("#dynamicInstructorPreferences div")[0]) {
                $("#dynamicInstructorPreferences div").css({
                    "display": "none"
                });

                this.finishEditingPreferences();
            }
        });
    }

    setPreferencesButtons(enable) {
        var preferenceButtons = $(".preferences");

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
        $(".modal-header").html(instructor);
        $(".modal-body p").html("The following table outlines " + instructor + "'s level preferences.");

        this.levelPreferences(instructor);
    }

    /**
     * Generates the list of all lesson types in the Preferences table.
     */
    levelPreferences(instructor) {
        if (!(instructor in this.preferences)) {
            this.preferences[instructor] = jQuery.extend(true, [], this.defaultPreferences);
        }

        // Create HTML table from the Preferences object.
        var newTable = "";
        for (var row = 0; row < 5; row++) {
            var rowClass = (row % 2 === 0) ? "table-odd" : "table-even";

            newTable += "<tr class='" + rowClass + "'>";

            for (var col = 0; col < 5; col++) {
                var className = "is-left ";
                var lessonType = this.preferences[instructor][col][row] || "";

                if (lessonType.charAt(0) === "r") {
                    lessonType = lessonType.slice(1);
                    className += (row % 2 === 0) ? "remove-preference-odd" : "remove-preference-even";
                }

                newTable += "<td class='" + className + "'>" + lessonType + "</td>";
            }

            newTable += "</tr>";
        }

        $(".modal table tbody").html(newTable);
    }

    /**
     * Sets the state of the Preferences table to allow removal of cells.
     */
    editPreferences() {
        var lessonCells = $(".modal td").filter((cell) => {
            return cell < 15 || (cell % 5 !== 0 && cell % 5 !== 4);
        });

        // Place 'add-preference' or 'remove-preference' buttons in each table cell, depending on text.
        lessonCells.each((index, element) => {
            if ($(element).is(".remove-preference-odd", ".remove-preference-even")) {
                $(element).append("<span class='add-preference'>&#10003;</span>");
            } else {
                $(element).append("<span class='remove-preference'>×</span>");

            }
        });

        // Bind removal and re-adding buttons.
        $(".modal table .remove-preference").click(() => {
            this.togglePreferenceCell(true);
        });
        $(".modal table .add-preference").unbind("click").click(() => {
            this.togglePreferenceCell(false);
        });

        $(".modal-footer a").unbind("click");
        $(".modal-footer a").html("Finish Editing");
        $(".modal-footer a").click(this.finishEditingPreferences.bind(this));
    }

    /**
     * Toggles contents to the cell in the Preferences table and appends
     * 'remove-preference' or 'add-preference' span.
     */
    togglePreferenceCell(remove) {
        var className;
        var name = $(".modal-header").html();
        var row = $(event.target).closest("tr");
        var cell = $(event.target).closest("td");
        var cellIndex = row.children().index(cell);
        var rowIndex = $(".modal-body tr").index(row) - 1;

        if (row.hasClass("table-odd")) {
            className = "remove-preference-odd";
        } else if (row.hasClass("table-even")) {
            className = "remove-preference-even";
        }

        $(event.target).remove();

        if (remove) {
            this.preferences[name][cellIndex][rowIndex] = "r" + cell.html();

            cell.addClass(className);
            cell.append("<span class='add-preference'>&#10003;</span>");

            // Rebind each 'add-preference' to their new cell.
            $(".modal .add-preference").unbind("click").click(() => {
                this.togglePreferenceCell(false);
            });
        } else {
            this.preferences[name][cellIndex][rowIndex] = cell.html();

            cell.removeClass(className);
            cell.append("<span class='remove-preference'>×</span>");

            // Rebind each 'remove-preference' to react to their new cell.
            $(".modal .remove-preference").unbind("click").click(() => {
                this.togglePreferenceCell(true);
            });
        }
    }

    /**
     * Removes the 'remove-preference' and 'add-preference' spans from
     * the Preferences table .
     */
    finishEditingPreferences() {
        // Key in preferences to add updated value.
        var name = $(".modal-header").html();

        // Remove 'add-preference' or 'remove-preference' buttons.
        $(".modal span").remove();

        $(".modal-footer a").unbind("click");
        $(".modal-footer a").html("Edit");
        $(".modal-footer a").click(this.editPreferences.bind(this));

        this.props.callback(this.preferences, this.props.lipReader);
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
    lipReader: React.PropTypes.object.isRequired
}

export default InstructorPreferences;
