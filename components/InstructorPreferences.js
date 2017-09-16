/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for the collection of instructors for
 * the lesson calendar web application. The Instructors class is exported.
 *
 *
 * CHANGE LOG:
 *  25/10/16:
 *              Added the Instructors table. The header is not rendered
 *              dynamicaly.
 *              Added section description.
 *
 *  26/10/16:
 *              Statically defined header in render().
 *              Added button to display 'Preferences' modal, with 'Edit'
 *              button in modal. 'Edit' button randomizes the order of the
 *              preselected table elements.
 *              Added names to preferences modal header.
 *              Changed bind("click", function() {}) to click(function() {}).
 *              Added button to edit table of instructors.
 *              Added ability to add & remove instructors.
 *
 *  27/10/16:
 *              Added dynamic movement of the table when adding or removing rows.
 *              Added ability to dynamically add an individual instructor to
 *              the table.
 *              Added recolouring of table when the 'Add' or 'Finish Editing'
 *              buttons are clicked.
 *              Added all lessons to 'preferences-table'.
 *              Added instructor's name to 'order-description'.
 *              Added ability to remove preferences and recolour table properly.
 *
 *  28/10/16:
 *              Removed 'x' to close modal.
 *              Created & deleted _Instructors.js.
 *
 *  29/10/16:
 *              Added state; contains default preferences and unique data for
 *              each instructor in the table.
 *              Added ability to re-add items to preferences table.
 *              NOTE: if an instructor is removed from the table, their
 *              preferenecs remain, so they can be re-added.
 *
 *  30/10/16:
 *              Added infinite loop to add and remove items in 'preference-table'.
 *              Store 'preferences' as key-value object.
 *
 *  09/11/16:
 *              Added 'instructors' object to store contents of table.
 *              Added communication via props & callbacks to LIPReader.js.
 *
 *  11/11/16:
 *              Remove addition of new rows on click of 'edit-instructors'.
 *              Resized section on addition of new rows.
 *
 *  12/11/16:
 *              Added dynamic sizing so component takes up window.
 *
 *  07/12/16:
 *              Added storage of instructor preferences upon clicking
 *              'Finish Editing' in the 'preferences' modal.
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
        if (sessionStorage.getItem("instructorPreferences") && sessionStorage.getItem("instructorPreferences") !== "{}") {
            this.preferences = JSON.parse(sessionStorage.getItem("instructorPreferences"));
        }

        // Hide modal on click outside of modal.
        $(window).click(function(e) {
            if (e.target === $("#instructorPreferences-modal")[0]) {
                $("#instructorPreferences-modal").css({
                    "display": "none"
                });
                this.finishEditingPreferences();
            }
        }.bind(this));

        $("#edit-preferences").click(this.editPreferences.bind(this));
    }

    togglePreferencesButtons(enable) {
        var numInstructors = $("#instructor-table").find("tr").length - 1;

        if (enable) {
            // Click events to display 'preferences' modal and style table in modal.
            for (var instructorPreferenceID = 0; instructorPreferenceID < numInstructors; instructorPreferenceID++) {
                $("#preferences".concat(instructorPreferenceID)).click(this.displayPreferenceModal).click(this.levelPreferences.bind(this));
                $("#preferences".concat(instructorPreferenceID)).removeClass("pure-button-disabled");
            }
        } else {
            for (var instructorPreferenceID = 0; instructorPreferenceID < numInstructors; instructorPreferenceID++) {
                $("#preferences".concat(instructorPreferenceID)).unbind("click");
                $("#preferences".concat(instructorPreferenceID)).addClass("pure-button-disabled");
            }
        }

    }

    /**
     * Displays preference modal
     */
    displayPreferenceModal() {
        // Show modal.
        $("#instructorPreferences-modal").css({
            "display": "block"
        });

        // Place contents of first cell of row in modal header and decription.
        var instructorName = $("#instructor-table tbody tr:eq(" +  this.id.replace("preferences", "") + ") td:eq(0)").text();
        $("#instructor-name").empty().append(instructorName);
        $("#order-description").empty().prepend("The following table outlines " + instructorName + "'s level preference in descending order.");
    }

    /**
     * Generates the list of all lesson types in the body of 'preference-table'.
     */
    levelPreferences() {
        var name = $("#preference-table tbody").parent().parent().parent().children().children()[0].innerHTML;

        if (!(name in this.preferences))
            this.preferences[name] = jQuery.extend(true, [], this.defaultPreferences);

        // Create HTML table from the related preferences.
        var newTable = "";
        for (var levels = 0; levels < 5; levels++) {
            newTable += "<tr" + ((levels % 2 == 0) ? " class='table-odd'" : " class='table-even'") + ">";
            for (var col = 0; col < 5; col++)
                newTable += "<td id='col" + levels + "" + col + "'" + "class='is-left'>" + (this.preferences[name][col][levels] ? this.preferences[name][col][levels] : "") + "</td>";
            newTable += "</tr>";
        }

        $("#preference-table tbody").empty().append(newTable);
    }

    /**
     * Sets the state of 'preference-table' to allow removal and movemen of rows.
     */
    editPreferences() {
        // Place 'add' or 'close' buttons in each table cell, depending on text.
        $("#preference-table tbody tr td").each(function() {
            // col30, col34, col40, col44 are designed to be empty.
            if (this.id !== "col30" && this.id !== "col34" && this.id !== "col40" && this.id !== "col44") {
                if (this.innerHTML !== "")
                    $(this).append("<span class='close'>×</span>");
                else
                    $(this).append("<span class='add-preference'>&#10003;</span>");
            }
        });

        // For calling class functions in annonymous functions without binding.
        var that = this;
        $("#preference-table .close").click(function() {
            that.removePreferenceCell(this);
        });

        $("#edit-preferences").empty().append("Finish Editing").unbind("click").click(this.finishEditingPreferences.bind(this));
    }

    /**
     * Removes contents from the cell in 'preference-table' and replaces with
     * an 'add-preference' object.
     */
    removePreferenceCell(that) {
        // Location of data in the 2-dimensional defaultPreferences array.
        var col = parseInt(that.closest("td").id.replace("col", "").charAt(0));
        var row = parseInt(that.closest("td").id.replace("col", "").charAt(1));

        // Key in preferences to add updated value.
        var name = $("#" + that.closest("td").id).parent().parent().parent().parent().parent().children().children()[0].innerHTML;

        // Replace preferences cell with updated preferences.
        this.preferences[name][row][col] = "";

        // Replace HTML of cell to 'add' button.
        $("#" + that.closest("td").id)[0].innerHTML = "<span class='add-preference'>&#10003;</span>";

        // Rebind each 'add' to their new cell.
        that = this;
        $("#preference-table .add-preference").unbind("click").click(function() {
            that.addPreferenceCell(this);
        });
    }

    /**
     * Adds contents to the cell in 'preference-table' and appends a
     * 'close' object.
     *
     * The Instructors React class object is passed as a parameter.
     */
    addPreferenceCell(that) {
        // Location of data in the 2-dimensional defaultPreferences array.
        var col = parseInt(that.closest("td").id.replace("col", "").charAt(0));
        var row = parseInt(that.closest("td").id.replace("col", "").charAt(1));

        // Key in preferences to add updated value.
        var name = $("#" + that.closest("td").id).parent().parent().parent().parent().parent().children().children()[0].innerHTML;

        $("#" + that.closest("td").id)[0].innerHTML = this.defaultPreferences[row][col].concat("<span class='close'>×</span>");

        // Replace preferences cell with updated preferences.
        this.preferences[name][row][col] = this.defaultPreferences[row][col];

        // Rebind each 'close' to react to their new cell.
        that = this;
        $("#preference-table .close").unbind("click").click(function() {
            that.removePreferenceCell(this);
        });
    }

    /**
     * Removes the 'x' spans from each cell in 'preference-table'.
     */
    finishEditingPreferences() {
        // Key in preferences to add updated value.
        var name = $("#preference-table").parent().parent().children().children()[0].innerHTML;

        // Temporary array to update preferences and protect preferences.
        var prefArray = jQuery.extend(true, {}, this.preferences[name]);

        // Remove 'add' or 'close' buttons.
        $("#preference-table tr td span").remove();

        $("#preference-table tr").each(function () {
            $("td", this).each(function () {
                if (this.id !== "col30" && this.id !== "col34" && this.id !== "col40" && this.id !== "col44")
                    prefArray[parseInt(this.id.replace("col", "").charAt(1))][parseInt(this.id.replace("col", "").charAt(0))] = $(this).text();
            });
        });

        // Replace preferences array with updated preferences.
        this.preferences[name] = jQuery.extend(true, [], prefArray);

        $("#edit-preferences").empty().append("Edit").unbind("click").click(this.editPreferences.bind(this));

        this.props.callback(this.preferences, this.props.lipReader);
    }

    render() {
        return (
                <div id="instructorPreferences-container">
                    <div id="instructorPreferences-modal" className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div id="instructor-name"></div>
                            </div>
                            <div className="modal-body">
                                <p id="order-description"></p>
                                <table id="preference-table" className="pure-table">
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
                                <a id="edit-preferences" className="pure-button">Edit</a>
                            </div>
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
