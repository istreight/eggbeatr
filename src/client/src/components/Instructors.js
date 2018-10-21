/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for the
 *  collection of instructors for the web application.
 * The Instructors class is exported.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


class Instructors extends React.Component {
    constructor(props) {
        super(props);

        this.instructors = {};
    }

    componentDidMount() {
        var numValidInstructors;

        this.sortInstructors(this.props.initData);

        this.generateInstructorTable();

        numValidInstructors = this.getNumInstructors();

        this.props.callback(this.instructors, "instructors", false);
        this.props.setChecklistQuantity("instructors", numValidInstructors);

        $("#dynamicInstructors .ribbon-section-description a").click(this.editInstructors.bind(this));
        $("#dynamicInstructors input[type='checkbox']").click(this.updatePrivateOnly.bind(this));

        // Link tutorital button to next section.
        $("#dynamicInstructors .pure-button-primary").click(() => {
            // Disable scrolling.
            $("body").on("mousewheel DOMMouseScroll", false);

            $("#dynamicLessons .content-section-footer").css({
                "display": "block"
            });

            $("html, body").animate({
                scrollTop: $("#dynamicLessons").offset().top - 60
            }, 1600, () => {
                $("body").off("mousewheel DOMMouseScroll");
                $("#dynamicInstructors .ribbon-section-footer").css({
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
        $("#dynamicInstructors td").each((index, element) => {
            if ($(element).children().length === 0) {
                var headerCells = $("#dynamicInstructors th");

                if (index % headerCells.length === 3) {
                    $(element).addClass("is-center");
                    $(element).html("<input type='checkbox'>");
                    $(element).children("input[type='checkbox']").prop("disabled", true);
                } else {
                    var placeholder = $(element).text() || "...";
                    $(element).html("<input type='text' placeholder='" + placeholder + "'>");
                }
            }
        });
    }

    /**
     * Appends new input row to the Instructors table.
     */
    addInputRow() {
        var instructorTable = $("#dynamicInstructors table");
        var numRows = instructorTable.find("tr").length - 1;
        var className = (numRows % 2 === 0) ? "table-odd" : "table-even";

        instructorTable.append("<tr class='" + className + "'><td></td><td></td><td></td><td></td><td class='is-center'><a class='pure-button pure-button-disabled preferences'>...</a></td><td class='is-center'><a class='pure-button add'>Add</a></td></tr>");

        // Bind 'add' buttons for new rows.
        instructorTable.find(".add").click(this.addRow.bind(this));
    }

    /**
     * Resets the table to appropriate colour scheme.
     */
    colourTable() {
        $("#dynamicInstructors tbody tr").each((index, element) => {
            $(element).removeClass("table-odd table-even");
             $(element).addClass((index % 2 === 0) ? "table-odd" : "table-even");
        });
    }

    /**
     * Places the instructor table in a state where the
     *  contents of the table can be changed.
     * The data in the input field will replace any data
     *  that was previously in the table cell.
     * Leaving any input field empty will not replace the
     *  original data.
     */
    editInstructors() {
        var editInstructorsButton = $("#dynamicInstructors .ribbon-section-description a");

        // Re-name and re-bind 'Edit Instructors' button.
        editInstructorsButton.unbind("click");
        editInstructorsButton.html("Finish Editing");
        editInstructorsButton.click(this.finishEditingInstructors.bind(this));

        $("#dynamicInstructors input[type='checkbox']").prop("disabled", true);

        // Add 'Modify' column.
        $("#dynamicInstructors thead tr").append("<th class='is-center'>Modify</th>");
        $("#dynamicInstructors tbody tr").append("<td class='is-center'><a class='pure-button remove'>Remove</a></td>");

        this.addInputRow();
        this.inputifyRows();

        $("#dynamicInstructors table .remove").click(this.removeRow.bind(this));

        this.setPreferencesButtons(false);
    }

    /**
     * Removes the row of the table of a clicked
     *  'remove' button.
     */
    removeRow() {
        var removedRow = $(event.target).closest("tr");
        var removedData = removedRow.find("input");
        var reName = new RegExp(/^[A-Za-z\s]+$/);
        var instructor = removedData.filter((index, element) => {
            return reName.test($(element).attr("placeholder"));
        });

        var instructorName = instructor.attr("placeholder");
        if (instructorName in this.instructors) {
            var instructorId = this.instructors[instructorName].id;

            this.props.removeComponent(instructorId, "Instructor").then((res) => delete this.instructors[instructorName]);

            this.props.deletePreference(instructorName);
        }

        removedRow.remove();

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Verify the contents of each input field and commit
     *  to the table.
     */
    addTableContents(removeInputRow) {
        var tableRows = $("#dynamicInstructors tr");
        var tableCells = $("#dynamicInstructors td");

        // Add row to table.
        var addedCells = true;
        var instructorList = [];
        var numColumns = tableCells.length / (tableRows.length - 1);
        tableCells.each((index, element) => {
            var isFirstChild = index % numColumns === 0;

            addedCells = this.addCells(element, instructorList, isFirstChild, removeInputRow) && addedCells;
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
     * Add a row to the table when the 'add' button
     *  is clicked.
     */
    addRow() {
        var isValid = this.addTableContents(false);

        if (!isValid) {
            return;
        }

        this.addInputRow();
        this.inputifyRows();

        // Add row to instructors object.
        var instructorName;
        var body = {};
        var addedData = $(event.target).closest("tr").find("input");
        var preferencesButton = $(event.target).closest("tr").find("a.preferences");

        addedData.each((index, element) => {
            var inputPlaceholder = $(element).attr("placeholder");

            if (inputPlaceholder === "...") {
                return true;
            }

            if (index === 0) {
                    instructorName = inputPlaceholder;

                    body.instructor = instructorName;
            } else if (index === 1) {
                body.dateOfHire = inputPlaceholder;
            } else if (index === 2) {
                var newDate = new Date(inputPlaceholder);
                var cell = $(element).closest("td");
                this.checkWSIExpiration(cell, newDate);

                body.wsiExpiration = inputPlaceholder;
            }
        });

        preferencesButton.attr("data-instructor-name", instructorName);

        this.props.createComponent(body, "Instructor")
            .then((res) => {
                this.sortInstructors(Object.assign(this.instructors, res));

                // Embed ID in DOM.
                $("#dynamicInstructors table tr").last().prev().attr("data-instructor-id", res[instructorName].id);

                // Bind click to change 'privateOnly' field.
                var checkedBoxes = $("#dynamicInstructors input[type='checkbox']").slice(0, -1);
                checkedBoxes.prop("disabled", false);
                checkedBoxes.click(this.updatePrivateOnly.bind(this));
            });

        // Put 'remove' in the last cell of the row.
        $(event.target).closest("td").html("<a class='pure-button remove'>Remove</a>");

        // Rebind each 'remove'.
        $("#dynamicInstructors table .remove").click(this.removeRow.bind(this));

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Adds the input values or valid placeholder values
     *  from the input fields to the table.
     */
    addCells(cell, instructorList, isFirstChild, removeInputRow) {
        var isWSIValue = false;
        var cellIndex = $(cell).index();
        var cellElement = $(cell).children().first();
        var thCells = $(cell).closest("table").find("th");

        if (thCells.eq(cellIndex).html() === "WSI Expiration") {
            isWSIValue = true;
        }

        if (cellElement.is("input")) {
            if (cellElement.attr("placeholder") === "..." && removeInputRow) {
                $(cell).closest("tr").remove();

                return true;
            } else if (cellElement.attr("type") === "checkbox") {
                return true;
            }

            // Input field data (or placeholder value for existing data).
            var newData = cellElement.val() || cellElement.attr("placeholder");
            newData = newData.replace(/^\s+|\s+$/, "");

            var expiryTime;
            var isValidData = false;
            if (isFirstChild) {
                var reName = new RegExp(/^[A-Za-z\s]+$/);

                isValidData = reName.test(newData) && !instructorList.includes(newData);

                instructorList.push(newData);
            } else if (newData.split("-").length === 3) {
                isValidData = !isNaN(Date.parse(newData));
                expiryTime = Date.parse(newData);
            }

            if (isValidData) {
                $(cell).html(newData);
                $(cell).removeClass("error-cell");

                if (expiryTime && isWSIValue) {
                    this.checkWSIExpiration(cell, expiryTime);
                }
            } else {
                $(cell).hide().addClass("error-cell").fadeIn(800);
                cellElement.val("");
            }

            return isValidData;
        }

        return true;
    }

    /**
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its original
     *  data.
     */
    finishEditingInstructors() {
        var tableRows;
        var numValidInstructors;
        var editPromises = [];
        var editInstructorsButton = $("#dynamicInstructors .ribbon-section-description a");

        var isValid = this.addTableContents(true);

        if (!isValid) {
            return;
        }

        tableRows = $("#dynamicInstructors tr");

        // Update class object with new values.
        tableRows.each((rowIndex, row) => {
            var instructor;
            var instructorId;
            var instructorName;

            // Remove 'Modify' column & skip header row.
            if (rowIndex === 0) {
                $(row).children("th").last().remove();

                return true;
            } else {
                $(row).children("td").last().remove();
            }

            instructorId = $(row).attr("data-instructor-id");

            [instructor, instructorName] = this.findInstructorById(instructorId);

            $(row).children("td").each((cellIndex, element) => {
                var cellText = $(element).text();

                if (cellText !== "...") {
                    if (cellIndex === 0) {
                        if (!(cellText in this.instructors)) {
                            this.instructors[cellText] = instructor;

                            delete this.instructors[instructorName];
                        }
                    } else if (cellIndex === 1) {
                        instructor.dateOfHire = cellText;
                    } else if (cellIndex === 2) {
                        instructor.wsiExpiration = cellText;
                    }
                }
            });
        });

        // Re-title and re-bind 'Edit Instructors' button.
        editInstructorsButton.unbind("click");
        editInstructorsButton.html("Edit Instructors");
        editInstructorsButton.click(this.editInstructors.bind(this));

        $("#dynamicInstructors input[type='checkbox']").prop("disabled", false);

        numValidInstructors = this.getNumInstructors();
        this.setPreferencesButtons(true);

        this.props.callback(this.instructors, "instructors", true);
        this.props.setChecklistQuantity("instructors", numValidInstructors);
    }

    /**
     * Transforms the Instructors object to an HTML table.
     */
    generateInstructorTable() {
        var isOdd = true;
        var newTable = "";

        this.sortInstructors(this.instructors);

        for (var instructorName in this.instructors) {
            var rowColour = isOdd ? "table-odd" : "table-even";
            var reDate = new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

            var instructor = this.instructors[instructorName];
            var instructorId = instructor.id;
            var dateOfHire = instructor.dateOfHire;
            var privateOnly = instructor.privateOnly;
            var wsiExpiration = instructor.wsiExpiration;

            var isChecked = privateOnly ? "checked" : "";
            var checkbox = "<input type='checkbox'" + isChecked + ">";

            var wsiExpirationCell = "<td>" + wsiExpiration + "</td>";

            newTable += "<tr class='" + rowColour + "' data-instructor-id='" + instructorId + "'>";

            newTable += "<td>" + instructorName + "</td>";
            newTable += "<td>" + dateOfHire + "</td>";

            // Placing indicators if WSI is expiring or expired.
            if (reDate.test(wsiExpiration)) {
                var cellObject = this.checkWSIExpiration(
                    $(wsiExpirationCell),
                    Date.parse(wsiExpiration)
                );

                wsiExpirationCell = cellObject.get(0).outerHTML;
            }

            newTable += wsiExpirationCell
            newTable += "<td class='is-center'>" + checkbox + "</td>"

            newTable += "<td class='is-center'><a class='pure-button preferences'>...</a></td>";
            newTable += "</tr>";

            isOdd = !isOdd;
        }

        $("#dynamicInstructors tbody").html(newTable);

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Update the 'privateOnly' field of an instructor.
     */
    updatePrivateOnly() {
        var row = $(event.target).closest("tr");
        var id = row.attr("data-instructor-id");
        var checkedBoxes = row.find("input:checked");
        var [instructor, instructorName] = this.findInstructorById(id);

        instructor.privateOnly = checkedBoxes.length > 0;
        this.props.callback(this.instructors, "instructors", true);
        this.props.setChecklistQuantity("instructors", this.getComponentQuantity());
    }

    /**
     * Check if the WSI certification date is expiring or expired.
     */
    checkWSIExpiration(cell, expiryTime) {
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        if (expiryTime < Date.now()) {
            // Date has expired.
            $(cell).addClass("error-cell");
        } else if (expiryTime < Date.now() + sixtyDaysInMilliseconds) {
            // Date is expiring in 60 days.
            $(cell).addClass("warning-table");
        }

        return cell;
    }

    /**
     * Find the instructor object & instructor name by id.
     */
    findInstructorById(id) {
        var instructorId = parseInt(id, 10);

        for (var instructorName in this.instructors) {
            var instructor = this.instructors[instructorName];

            if (instructor.id === instructorId) {
                return [instructor, instructorName];
            }
        }

        return [false, ""];
    }

    /**
     * Get the number of stored instructors.
     */
    getNumInstructors() {
        var expiredArray;
        var instructorsArray = Object.keys(this.instructors);
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        expiredArray = instructorsArray.filter((instructorName) => {
            var instructor = this.instructors[instructorName];
            var expiryTime = instructor.wsiExpiration;

            return Date.parse(expiryTime) < Date.now() + sixtyDaysInMilliseconds;
        });

        return instructorsArray.length - expiredArray.length;
    }

    /**
     * Sort object keys alphabetically into instructors.
     */
    sortInstructors(instructors) {
        var sorted = {};

        Object.keys(instructors).sort().forEach((key) => {
            sorted[key] = instructors[key];
        });

        this.instructors = sorted;
    }

    /**
     * Size the table based on the number of instructors.
     */
    sizeTable() {
        var newHeight;
        var numRows = $("#dynamicInstructors tr").length;

        if (numRows > 5) {
            newHeight = 7.125 * (numRows - 5) + 92;
        } else {
            newHeight = 92;
        }

        $("#dynamicInstructors").css({
            "height": newHeight + "vh"
        });
    }


    /**
     * Disables the preferences button in the Instructors table.
     */
    setPreferencesButtons(enable) {
        return;
        var preferenceButtons = $("#dynamicInstructors .preferences");

            if (enable) {
            preferenceButtons.removeClass("pure-button-disabled");
            preferenceButtons.click(this.props.handlePreferencesClick);
            } else {
            preferenceButtons.unbind("click");
            preferenceButtons.addClass("pure-button-disabled");
            }
    }

    render() {
        return (
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
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
                    <a className="pure-button left-button">
                        Edit Instructors
                    </a>
                </div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th className="is-center">
                                Instructor
                            </th>
                            <th className="is-center">
                                Date of Hire
                            </th>
                            <th className="is-center">
                                WSI Expiration
                            </th>
                            <th className="is-center">
                                Privates Only
                            </th>
                            <th className="is-center">
                                Preferences
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div className="ribbon-section-footer">
                    <h2 className="content-head content-head-ribbon">
                        Step #1:
                    </h2>
                    <p>
                        List the instructors teaching in this lesson set. Once added, their individual preferences become available.
                    </p>
                    <a className="pure-button pure-button-primary">
                        &rarr;
                    </a>
                </div>
            </div>
        );
    }
}

Instructors.propTypes = {
    callback: PropTypes.func.isRequired,
    connector: PropTypes.object.isRequired,
    createComponent: PropTypes.func.isRequired,
    deletePreference: PropTypes.func.isRequired,
    handlePreferencesClick: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    removeComponent: PropTypes.func.isRequired,
    setChecklistQuantity: PropTypes.func.isRequired
}

export default Instructors;
