/**
 * FILENAME:    Private.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the Private class for the collection of private lessons
 * for the lesson calendar web application. The Private class is exported.
 */

import React from 'react';

class Private extends React.Component {
    constructor(props) {
        super(props);

        this.numPrivate = 0;
        this.privateLessons = {};
    }

    componentDidMount() {
        var sesssionPrivate = sessionStorage.getItem("private");
        if (sesssionPrivate && sesssionPrivate !== "{}") {
            this.privateLessons = JSON.parse(sesssionPrivate);
        } else {
            // For default table display.
            this.privateLessons = {
                "Alfa": {
                    "9:00": ["30", "Yes"]
                },
                "Bravo": {
                    "9:30": ["30", "No"]
                },
                "Charlie": {
                    "10:00": ["30", "No"]
                }
            };
        }

        this.generatePrivate();
        this.numPrivate = this.getNumPrivates();

        this.props.callback(this.privateLessons, this.props.lipReader);
        this.props.gridChecklist.setQuantity("privates", this.numPrivate);

        // Assign text in drop down to 'privateLessons'.
        $("#dynamicPrivate table td li a").click(() => {
            // Update privateLessons.
            var timeSlot;
            var instructor;
            var row = $(event.target).closest("tr").children();
            row.each((index, element) => {
                var elementText = $(element).text();

                if (index === 0) {
                    instructor = this.privateLessons[elementText];

                    return instructor !== undefined;
                } else if (index === 1) {
                    timeSlot = instructor[elementText];

                    return timeSlot !== undefined;
                } else {
                    if ($(element).children().length === 0) {
                        timeSlot[0] = elementText;
                    } else {
                        timeSlot[1] = $(event.target).text();
                    }
                }
            });

            this.numPrivate = this.getNumPrivates();

            this.props.gridChecklist.setQuantity("privates", this.numPrivate);

            if (timeSlot !== undefined) {
                this.props.callback(this.privateLessons, this.props.lipReader);
            }

            // Modify displayed text.
            this.updateIncludeText(event.target);
        });

        $("#dynamicPrivate .ribbon-section-description a").click(this.editPrivate.bind(this));

        // Link tutorital button to next section.
        $("#dynamicPrivate .ribbon-section-footer a").click(() => {
            // Disable scrolling.
            $("body").on("mousewheel DOMMouseScroll", false);

            $("#dynamicGrid .content-section-footer").css({
                "display": "block"
            });

            $("#dynamicPrivate .ribbon-section-footer").fadeOut(1000);

            $("html, body").animate({
                scrollTop: $("#dynamicGrid").offset().top - 60
            }, 1600, () => {
                $("body").off("mousewheel DOMMouseScroll");

                $("#dynamicPrivate .ribbon-section-footer").css({
                    "display": "none"
                });
            });
        });
    }

    /**
     * Replaces the text of the Instructor table cells
     *  with input fields.
     * The placeholder values of the existing fields are
     *  their text values.
     */
    inputifyRows() {
        $("#dynamicPrivate table td").each((index, element) => {
            if ($(element).children().length === 0) {
                var placeholder = $(element).text() || "...";
                $(element).html("<input type='text' placeholder='" + placeholder + "'>");
            }
        });
    }

    /**
     * Appends new input row to the Instructors table.
     */
    addInputRow() {
        var privateTable = $("#dynamicPrivate table");
        var numRows = privateTable.find("tr").length - 1;
        var className = (numRows % 2 === 0) ? "table-odd" : "table-even";

        // Append row of input fields and 'add' button.
        privateTable.append("<tr class='" + className + "'><td><td></td><td></td><td><div></div></td><td class='is-center'><a class='pure-button add'>Add</a></td></tr>");

        // Bind 'Add' buttons for new rows.
        privateTable.find(".add").click(this.addRow.bind(this));
    }

    /**
     * Resets the table to appropriate colour scheme.
     */
    colourTable() {
        // Recolour rows.
        $("#dynamicPrivate table tbody tr").each((index, element) => {
            $(element).removeClass("table-even table-odd");
            $(element).addClass((index % 2 === 0) ? "table-odd" : "table-even");
        });
    }

    /**
     * Places the private table in a state where the contents of the table
     *  can be changed.
     * The data in the input field will replace any data that was previously in
     *  the table cell. Leaving any input field empty will not replace the
     *  original data.
     */
    editPrivate() {
        var editPrivate = $("#dynamicPrivate .ribbon-section-description a");

        // Re-name and re-bind 'Edit Privates' button.
        editPrivate.unbind("click");
        editPrivate.html("Finish Editing");
        editPrivate.click(this.finishEditingPrivate.bind(this));

        // Add 'Modify' column.
        $("#dynamicPrivate table thead tr").append("<th class='is-center'>Modify</th>");
        $("#dynamicPrivate table tbody tr").append("<td class='is-center'><a class='pure-button remove'>Remove</a></td>");

        this.addInputRow();
        this.inputifyRows();

        $("#dynamicPrivate table .remove").click(this.removeRow.bind(this));
    }

    /**
     * Removes the row of the table of a clicked 'remove' button.
     */
    removeRow() {
        var removedRow = $(event.target).closest("tr");
        var removedData = removedRow.find("input");
        var reName = new RegExp(/^[A-Za-z\s]+$/);
        var instructor = removedData.filter((index, element) => {
            return reName.test($(element).attr("placeholder"));
        });

        var instructorName = instructor.attr("placeholder");
        if (instructorName in this.privateLessons) {
            delete this.privateLessons[instructorName];
        }

        removedRow.remove();

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Verify the contents of each input field and commit it to the table.
     */
    addTableContents(removeInputRow) {
        var tableRows = $("#dynamicPrivate tr");
        var tableCells = $("#dynamicPrivate td");

        // Add row to table.
        var addedCells = true;
        var numColumns = tableCells.length / (tableRows.length - 1);
        tableCells.each((index, element) => {
            var isFirstChild = index % numColumns === 0;

            addedCells = this.addCells(element, isFirstChild, removeInputRow) && addedCells;
        });

        if (!addedCells) {
            if (removeInputRow) {
                this.addInputRow();
            }

            this.inputifyRows();
        }

        return addedCells;
    }

    /**
     * Add a row to the table when the 'add' button is clicked.
     */
    addRow() {
        var isValid = this.addTableContents(false);

        if (!isValid) {
            return;
        }

        this.addInputRow();
        this.inputifyRows();

        // Add row to privateLessons object.
        var timeSlot;
        var instructorName;
        var addedData = $(event.target).closest("tr").find("input");
        addedData.each((index, element) => {
            var inputPlaceholder = $(element).attr("placeholder");

            if (inputPlaceholder !== "...") {
                if (index === 0) {
                    instructorName = inputPlaceholder;
                    this.privateLessons[instructorName] = {};
                } else if (index === 1) {
                    timeSlot = inputPlaceholder;
                    this.privateLessons[instructorName][timeSlot] = [];
                } else if (instructorName) {
                    this.privateLessons[instructorName][timeSlot].push(inputPlaceholder);
                }
            }
        });


        this.numPrivate = this.getNumPrivates();

        // Put 'remove' in the last cell of the row.
        $(event.target).closest("td").html("<a class='pure-button remove'>Remove</a>");

        // Rebind each 'remove'.
        $("#dynamicPrivate table .remove").click(this.removeRow.bind(this));

        this.sizeTable();
    }

    /**
     * Adds the input values or valid placeholder values from
     *  the input fields to the table.
     */
    addCells(cell, isFirstChild, removeInputRow) {
        var isValidData = false;
        var cellElement = $(cell).children().first();

        if (cellElement.is("input")) {
            if (cellElement.attr("placeholder") === "..." && removeInputRow) {
                $(cell).closest("tr").remove();

                return true;
            }

            // Input field data (or placeholder value for existing data).
            var newData = cellElement.val() || cellElement.attr("placeholder");
            newData = newData.replace(/^\s+|\s+$/, "");

            if (isFirstChild) {
                var reName = new RegExp(/^[A-Za-z\s]+$/);

                isValidData = reName.test(newData);
            } else if (newData.split(":").length === 2){
                var [hour, minute] = newData.split(":");
                var reHour = new RegExp(/^0?[0-9]|1[0-2]$/);
                var reMinute = new RegExp(/^(00|15|30|45)$/);

                isValidData = reHour.test(hour) && reMinute.test(minute);
            } else {
                var reDuration = new RegExp(/^(0|15|30|45)$/);
                var duration = parseInt(newData, 10) % 60;

                isValidData = reDuration.test(duration);
            }

            if (isValidData) {
                $(cell).html(newData);
                $(cell).removeClass("error-cell");
            } else {
                $(cell).hide().addClass("error-cell").fadeIn(800);
                cellElement.val("");
            }

            return isValidData;
        } else if (cellElement.is("div") && cellElement.children().length === 0) {
            // Place a 'include' dropdown menu.
            $(cell).html(
                "<div class='pure-menu pure-menu-horizontal'><ul class='pure-menu-list'><li class='pure-menu-item pure-menu-has-children pure-menu-allow-hover'><a class='pure-menu-link menu-odd'>No</a><ul class='pure-menu-children'><li class='pure-menu-item'><a class='pure-menu-link'>Yes</a></li><li class='pure-menu-item'><a class='pure-menu-link'>No</a></li></ul></li></ul></div>"
            );

            // Bind 'include' buttons to show selected option.
            var newIncludeAnchor = $(cell).find("a");
            newIncludeAnchor.click(() => {
                // Set visible string.
                this.updateIncludeText(event.target);

                // Update privateLessons.
                var timeSlot;
                var instructor;
                var row = $(event.target).closest("tr").children();
                row.each((index, element) => {
                    var elementText = $(element).text();

                    if (index === 0) {
                        instructor = this.privateLessons[elementText];
                    } else if (index === 1) {
                        timeSlot = instructor[elementText];
                    } else {
                        if ($(element).children().length === 0) {
                            timeSlot[0] = elementText;
                        } else {
                            timeSlot[1] = $(element).find("a").first().text();
                        }
                    }
                });

                if (timeSlot !== undefined) {
                    this.props.callback(this.privateLessons, this.props.lipReader);
                }
            });
        }

        return true;
    }

    /**
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its original data.
     */
    finishEditingPrivate() {
        var tableRows;
        var editPrivate = $("#dynamicPrivate .ribbon-section-description a");

        var isValid = this.addTableContents(true);

        if (!isValid) {
            return;
        }

        // Remove 'Modify' column.
        tableRows = $("#dynamicPrivate tr");
        tableRows.each((index, element) => {
            if (index === 0) {
                $(element).children("th").last().remove();
            } else {
                $(element).children("td").last().remove();
            }
        });

        // Update privateLessons.
        var timeSlot;
        var instructor;
        var instructorName;
        var privateTimeSlots = {};
        var privateInstructors = {};
        var row = $("#dynamicPrivate table").find("tbody").find("tr").children();
        row.each((index, element) => {
            if (index % 4 === 0) {
                instructorName = $(element).text();
                instructor = this.privateLessons[instructorName];

                if (instructor === undefined) {
                    instructor = {};
                    this.privateLessons[instructorName] = instructor;
                }
            } else if (index % 4 === 1) {
                var startTime = $(element).text();

                if (instructor[startTime] === undefined) {
                    instructor[startTime] = [];
                }

                if (privateTimeSlots[instructorName] === undefined) {
                    var newPrivate = {};
                    newPrivate[startTime] = instructor[startTime];
                    privateTimeSlots[instructorName] = newPrivate;
                } else {
                    privateTimeSlots[instructorName][startTime] = instructor[startTime];
                }

                timeSlot = instructor[startTime];
            } else {
                if ($(element).children().length === 0) {
                    timeSlot[0] = $(element).text();
                } else {
                    timeSlot[1] = $(element).find("a").first().text();
                }
            }
        });

        // Remove overwritten lesson time slots.
        for (var instructor in this.privateLessons) {
            if (!(instructor in privateTimeSlots)) {
                delete this.privateLessons[instructor];
            }

            for (var time in this.privateLessons[instructor]) {
                if (!(time in privateTimeSlots[instructor])) {
                    delete this.privateLessons[instructor][time];
                }
            }
        }

        // Re-title and re-bind 'Edit Private' button.
        editPrivate.unbind("click");
        editPrivate.html("Edit Private");
        editPrivate.click(this.editPrivate.bind(this));

        this.numPrivate = this.getNumPrivates();

        this.props.callback(this.privateLessons, this.props.lipReader);
        this.props.gridChecklist.setQuantity("privates", this.numPrivate);
    }

    /**
     * Transforms an array to a PureCSS table.
     */
    generatePrivate() {
        var isOdd = true;
        var newTable = "";

        for (var instructorName in this.privateLessons) {
            var rowClass = isOdd ? "table-odd" : "table-even";
            var instructor = this.privateLessons[instructorName];

            newTable += "<tr class='" + rowClass + "'>";
            newTable += "<td>" + instructorName + "</td>";


            for (var time in instructor) {
                var timeSlot = instructor[time];

                newTable += "<td>" + time + "</td>";

                for (var info = 0; info < timeSlot.length - 1; info++) {
                    newTable += "<td>" + timeSlot[info] + "</td>";
                }

                newTable += "<td><div class='pure-menu pure-menu-horizontal'><ul class='pure-menu-list'><li class='pure-menu-item pure-menu-has-children pure-menu-allow-hover'><a class='pure-menu-link menu-odd'>" + timeSlot[info] + "</a><ul class='pure-menu-children'><li class='pure-menu-item'><a  class='pure-menu-link'>Yes</a></li><li class='pure-menu-item'><a  class='pure-menu-link'>No</a></li></ul></li></div></td>";
            }

            newTable += "</tr>";

            isOdd = !isOdd;
        }

        $("#dynamicPrivate table tbody").append(newTable);
    }

    /**
     * Updates the text of parent drop-down.
     */
    updateIncludeText(menu) {
        var newIncludeValue = $(menu).text();
        var includeAnchor = $(menu).parents("li").eq(1).find("a").first();

        includeAnchor.text(newIncludeValue);
    }

    /**
     * Count the number of included private lessons.
     */
    getNumPrivates() {
        var numPrivate = 0;

        var instructors = [];
        var instructorRows = $("#dynamicPrivate tr");
        instructorRows.each((index, element) => {
            var cell = $(element).find("td").first();
            var elementText = cell.text();

            if (cell.length > 0 && !instructors.includes(elementText)) {
                instructors.push(elementText);
            }
        });

        for (var instructor in this.privateLessons) {
            for (var timeSlot in this.privateLessons[instructor]) {
                if (this.privateLessons[instructor][timeSlot][1] === "Yes" && instructors.includes(instructor)) {
                    numPrivate++;
                }
            }
        }

        return numPrivate;
    }

    /**
     * Sizes table based on number of rows.
     */
    sizeTable() {
        var newHeight;
        var numRows = $("#dynamicPrivate tr").length;

        if (numRows > 5) {
            newHeight = 7.125 * (numRows - 5) + 92;
        } else {
            newHeight = 92;
        }

        $("#dynamicPrivate").css({
            "height": newHeight + "vh"
        });
    }

    render() {
        return (
                <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
                    <h2 className="content-head content-head-ribbon">
                        Private Lessons
                    </h2>
                    <div className="ribbon-section-description">
                        Detail the private lessons.
                        <ul className="ribbon-section-explanation">
                            <li>Organize private lessons from the set</li>
                            <li>Specify the who, when, and how long</li>
                            <li>Modify their frequencies</li>
                        </ul>
                        <a className="pure-button left-button">
                            Edit Private
                        </a>
                    </div>
                    <table className="pure-table">
                        <thead>
                            <tr>
                                <th className="is-center">
                                    Instructor
                                </th>
                                <th className="is-center">
                                    Time
                                </th>
                                <th className="is-center">
                                    Duration
                                </th>
                                <th className="is-center">
                                    Include
                                </th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <div className="ribbon-section-footer">
                        <h2 className="content-head content-head-ribbon">
                            Step #3:
                        </h2>
                        <p>
                            List any private lessons occuring during this set.
                        </p>
                        <a className="pure-button pure-button-primary">
                            &rarr;
                        </a>
                    </div>
                </div>
        );
    }
}

Private.propTypes =  {
    callback: React.PropTypes.func.isRequired,
    lipReader: React.PropTypes.object.isRequired,
    gridChecklist: React.PropTypes.object.isRequired
}

export default Private;
