/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for the collection of instructors for
 * the lesson calendar web application. The Instructors class is exported.
 */

import React from 'react';
import InstructorPreferences from './InstructorPreferences';

class Instructors extends React.Component {
    constructor(props) {
        super(props);

        this.numInstructors = 0;
        this.instructors = {};
    }

    componentDidMount() {
        if (sessionStorage.getItem("instructors") && sessionStorage.getItem("instructors") !== "{}") {
            this.instructors = JSON.parse(sessionStorage.getItem("instructors"));

            this.numInstructors = Object.keys(this.instructors).length;
        } else {
            // For default table display.
            this.instructors["Alfa"] = ["01/02/11", "03/04/21"];
            this.instructors["Bravo"] = ["05/06/12", "07/08/22"];
            this.instructors["Charlie"] = ["09/10/13", "11/12/23"];
        }

        this.props.callback(this.instructors, this.props.lipReader);

        this.props.instructorPreferences.togglePreferencesButtons(true);

        // Number of table rows, not including header, in '#instructor-table'.
        this.numInstructors = this.generateGrid();

        this.props.gridChecklist.checkComplete($("#instructors-checklist"), this.numInstructors);

        // Make component size of window.
        $("#dynamicInstructors").css({
            "height": ($(window).height() - 55) + "px"
        });

        $("#edit-instructors").click(this.editInstructors.bind(this));

        // Link tutorital button to next section.
        $("#instructor-next").click(function() {
            $("body").on("mousewheel DOMMouseScroll", function() {
                return false;
            });
            $("#lessons-footer").css({
                "display": "block"
            });
            $("html, body").animate({
                scrollTop: $("#dynamicLessons").offset().top - 57
            }, 1600, function() {
                $("body").off("mousewheel DOMMouseScroll");
                $("#instructor-footer").css({
                    "display": "none"
                });
            });
        });
    }

    /**
     * Appends a row of input fields to the instructor table.
     */
    inputifyRows() {
        var instructorTable = $("#instructor-table");
        var numRows = instructorTable.find("tr").length - 1;

        // Append row of input fields and 'add' button.
        instructorTable.append("<tr id='instructor" + numRows + "' " + ((numRows % 2 == 0) ? "class='table-odd'" : "class='table-even'") + "><td>" + "<td></td><td></td><td><a id='preferences" + numRows + "' class='pure-button pure-button-disabled preferences'>...</a></td><td class='is-center'><a class='pure-button add'>Add</a></td></tr>");

        // Bind 'Add' buttons for new rows.
        instructorTable.find(".add").click(this.addRow.bind(this));

        // Replace text with input fields, customized placeholder based on text.
        instructorTable.find("td").each(function() {
            var firstChild = $(this).children().eq(0);

            if (firstChild.is("input")) {
                var placeholder = firstChild.attr("placeholder");
                $(this).empty().append("<input type='text' placeholder='" + placeholder + "'>");
            } else if (!firstChild.is("a")) {
                var placeholder = $(this).text() || "...";
                $(this).empty().append("<input type='text' placeholder='" + placeholder + "'>");
            }
        });
    }

    /**
     * Resets the table to appropriate colour scheme.
     */
     recolourTable() {
         // Recolour rows.
         $("#instructor-table").find("tr").each(function(index, element) {
             if (index === 0) {
                 // Skip header row.
                 return true;
             }

             $(element).addClass((index % 2 === 1) ? "table-odd" : "table-even");
             $(element).removeClass((index % 2 === 0) ? "table-odd" : "table-even");
         });
     }


    /**
     * Places the instructor table in a state where the contents of the table
     * can be changed.
     * The data in the input field will replace any data that was previously in
     * the table cell. Leaving any input field empty will not replace the
     * original data.
     */
    editInstructors() {
        // Re-title and re-bind 'Edit Instructors' button.
        $("#edit-instructors").empty().append("Finish Editing").unbind("click").click(this.finishEditingInstructors.bind(this));

        // Add 'Modify' column.
        $("#instructor-table thead tr").append("<th class='is-center'>Modify</th>");
        $("#instructor-table tbody tr").append("<td class='is-center'><a class='pure-button remove'>Remove</a></td>");

        this.inputifyRows();

        var that = this;
        $("#instructor-table .remove").click(function() {
            // Remove from 'instructors' object.
            delete that.instructors[$(this.closest("tr")).children().children()[0].placeholder];

            this.closest("tr").remove();

            that.recolourTable();
        });

        this.props.instructorPreferences.togglePreferencesButtons(false);
    }

    /**
     * Add a row to the table when the 'add' button is clicked.
     * Moves the 'instructor' table up the page.
     */
    addRow() {
        // Increase size of section.
        if ($("#instructor-table tr").length > 5) {
            $("#dynamicInstructors").css({
                "height": ($("#dynamicInstructors").height() + 142) + "px"
            });
        }

        // Add row to table.
        var that = this;
        $("#instructor-table tbody tr td").each(function() {
            that.addCells(this, false);
        });

        this.numInstructors++;

        // Add row to 'privateLessons' object.
        var instructorRow = $("#instructor-table tbody tr:last").children();
        var instructorName = $(instructorRow[0]).text();
        if (instructorName !== "...") {
            this.instructors[instructorName] = [$(instructorRow[1]).text(), $(instructorRow[2]).text(),];
        }

        // Append new row to allow multiple additions.
        this.inputifyRows();

        // Put 'remove' in the last cell of the row.
        $("#instructor-table tbody tr:nth-last-child(2) td:last").empty().append("<a class='pure-button remove'>Remove</a>");

        // Rebind each 'remove'.
        var that = this;
        $("#instructor-table tbody tr:nth-last-child(2) td:last .remove").click(function() {
            // Remove from 'instructors' object.
            delete that.instructors[$(this.closest("tr")).children().children()[0].placeholder];

            this.closest("tr").remove();

            that.recolourTable();
        });

        this.recolourTable();
    }

    /**
     * Adds a set of cells in a row when the 'add' button,
     * with data from the input fields.
     * Moves the 'instructor' table up the page.
     */
    addCells(that, removeInputRow) {
        var firstChild = $(that).children().eq(0);

        if (firstChild.is("input")) {
            // Remove unfilled input row.
            if (firstChild.attr("placeholder") === "..." && removeInputRow) {
                $(that).parent().remove();
                return true;
            }

            // Input field data (or placeholder value for existing data).
            var newData = firstChild.val() || firstChild.attr("placeholder");
            newData = newData.replace(/^\s+|\s+$/g, "");

            var expiryTime;
            var isValidData = false;
            if ($(that).is(":first-child")) {
                isValidData = /^[A-Za-z\s]+$/.test(newData);
            } else if (newData.split("/").length === 3) {
                // Order could be day/month/year or month/day/year.
                var testDay, testMonth, testYear;
                var reDay = new RegExp(/^(0?[1-9]|[1-2][0-9]|3[0-1])$/);
                var reMonth = new RegExp(/^(0?[1-9]|1[0-2])$/);
                var reYear = new RegExp(/^[0-9]?[0-9]$/);
                var [day, month, year] = newData.split("/");

                // Date objects use 'Month/Day/Year' order with forward slash seperated values.
                expiryTime = Date.parse([month, day, year].join("/"));

                // Expect first & second values to by day/month.
                testDay = reDay.test(day);
                testMonth = reMonth.test(month);
                if (!(testDay && testMonth)) {
                    // Accept first & second value to be month/day.
                    testMonth = reMonth.test(day);
                    testDay = reDay.test(month);
                }

                testYear = reYear.test(year);

                isValidData = testDay && testMonth && testYear;
            }

            if (isValidData) {
                $(that).empty().append(newData);
                $(that).removeClass("error-table");

                const thrityDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000

                var cellIndex = $(that).index();
                var thCells = $(that).closest("table").find("th");
                if (thCells.eq(cellIndex).text() === "WSI Expiration Date") {
                    // Only check expiration of WSI certification column.
                    if (expiryTime < Date.now()) {
                        // Date has expired.
                        $(that).addClass("error-table");
                    } else if (expiryTime < Date.now() + thrityDaysInMilliseconds) {
                        // Date is expiring in 30 days.
                        $(that).addClass("warning-table");
                    }
                }
            } else {
                $(that).hide().addClass("error-table").fadeIn(800);
                firstChild.val("");
            }

            return isValidData;
        }

        return true;
    }

    /**
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its original data.
     */
    finishEditingInstructors() {
        var instructorTable = $("#instructor-table");

        // Remove 'Modify' column.
        instructorTable.find("tr").each((index, element) => {
            if (index === 0) {
                $(element).children("th").last().remove();
            } else {
                $(element).children("td").last().remove();
            }
        });

        // Add row to table.
        var that = this;
        var addedCells = true;
        instructorTable.find("td").each(function() {
            addedCells = that.addCells(this, true) && addedCells;
        });
        if (!addedCells) {
            this.editInstructors();
            return;
        }

        // Re-title and re-bind 'Edit Instructors' button.
        var editInstructorsButton = $("#edit-instructors");
        editInstructorsButton.empty().append("Edit Instructors");
        editInstructorsButton.unbind("click").click(this.editInstructors.bind(this));

        this.props.gridChecklist.checkComplete($("#instructors-checklist"), this.numInstructors);

        this.props.instructorPreferences.togglePreferencesButtons(true);

        this.props.callback(this.instructors, this.props.lipReader);
    }

    /**
     * Transforms an array to a PureCSS table.
     * Note, the first row of the array is considered as the first row of the
     * table. The Header is defined statically within render().
     */
    generateGrid() {
        var instructorNames = Object.keys(this.instructors);

        var gridArray = [];
        for (var i = 0; i < Object.keys(this.instructors).length; i++) {
            gridArray.push([
                instructorNames[i],
                this.instructors[instructorNames[i]][0],
                this.instructors[instructorNames[i]][1],
                "<a id='preferences" + i + "' class='pure-button preferences'>...</a>"
            ]);
        }

        // Create HTML table from local gridArray.
        var newTable = "";
        for (var instructor = 0; instructor < gridArray.length; instructor++) {
            newTable += "<tr id='instructor" + instructor + "'" + ((instructor % 2 == 0) ? " class='table-odd'" : " class='table-even'") + ">";
            for (var slot = 0; slot < gridArray[0].length; slot++)
                newTable += "<td>" + gridArray[instructor][slot] + "</td>";
            newTable += "</tr>";
        }

        // Reposition container on new HTML table.
        $("#instructor-table tbody").append(newTable);

        return gridArray.length;
    }

    render() {
        return (
                <div id="instructor-container" className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
                    <h2 className="content-head content-head-ribbon">
                        Instructors
                    </h2>
                    <div className="ribbon-section-description">
                        Customize the team of instructors.
                        <ul className="ribbon-section-explanation">
                            <li>Add or remove instructors from the set</li>
                            <li>Say a little bit about them</li>
                            <li>Modify their teaching preferences</li>
                        </ul>
                        <a id="edit-instructors" className="pure-button">
                            Edit Instructors
                        </a>
                    </div>
                    <div id="instructor-table-container">
                        <table id="instructor-table" className="pure-table">
                            <thead>
                                <tr>
                                    <th className="is-center">
                                        Instructor
                                    </th>
                                    <th className="is-center">
                                        Date of Hire
                                    </th>
                                    <th className="is-center">
                                        WSI Expiration Date
                                    </th>
                                    <th className="is-center">
                                        Preferences
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div id="instructor-footer" className="ribbon-section-footer">
                        <h2 className="content-head content-head-ribbon">
                            <font color="white">Step #1:</font>
                        </h2>
                        <font color="#ddd">
                            List the instructors teaching in this lesson set. Once added, their individual preferences become available.
                        </font>
                        <a id="instructor-next" className="pure-button pure-button-primary">
                            &rarr;
                        </a>
                    </div>
                </div>
        );
    }
}

Instructors.propTypes =  {
    callback: React.PropTypes.func.isRequired,
    lipReader: React.PropTypes.object.isRequired,
    instructorPreferences: React.PropTypes.object.isRequired,
    gridChecklist: React.PropTypes.object.isRequired
}

export default Instructors;
