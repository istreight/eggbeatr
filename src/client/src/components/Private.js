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

        this.privateLessons = {};
        this.numPrivates = 0;
    }

    componentDidMount() {
        this.sortPrivates(this.props.initData);

        this.generatePrivate();
        this.numPrivates = this.getNumPrivates();

        this.props.callback(this.privateLessons, this.props.controller, false);
        this.props.setChecklistQuantity("privates", this.numPrivates);

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
        privateTable.append("<tr class='" + className + "'><td><td></td><td></td><td class='is-center'><a class='pure-button add'>Add</a></td></tr>");

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
        var instructorName;
        var time;
        var duration;
        var removedRow = $(event.target).closest("tr");
        var removedData = removedRow.find("input");
        var reName = new RegExp(/^[A-Za-z\s]+$/);
        var reTime = new RegExp(/^(0?[0-9]|1[0-2]):([0-5][05]|60)$/);
        var reDuration = new RegExp(/^([0-5][05]|60)$/);

        removedData.each((index, element) => {
            var inputPlaceholder = $(element).attr("placeholder");

            if (reName.test(inputPlaceholder)) {
                instructorName = inputPlaceholder;
            } else if (reTime.test(inputPlaceholder)) {
                time = inputPlaceholder;
            } else if (reDuration.test(inputPlaceholder)) {
                duration = parseInt(inputPlaceholder, 10);
            }
        });

        if (instructorName in this.privateLessons) {
            var privateInstructor = this.privateLessons[instructorName];

            for (var i = 0; i < privateInstructor.length; i++) {
                var validTime = time + ":00" === privateInstructor[i].time;
                var validDuration = duration === privateInstructor[i].duration;

                if (validTime && validDuration) {
                    var sliceIndex = i;
                    var privatesId = privateInstructor[i].id;

                    console.log("Sending delete Private request to database...");
                    this.props.connector.deletePrivatesData(privatesId)
                        .then((res) => {
                            console.log("Deleted Private:", res);
                            this.privateLessons[instructorName].splice(sliceIndex, 1);
                            this.numPrivates = this.getNumPrivates();
                        }).catch(error => console.error(error));
                    console.log("Sent delete Private request to database.");
                }
            }
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
        var instructorData;
        var body = {};
        var addedData = $(event.target).closest("tr").find("input");
        $(addedData.get().reverse()).each((index, element) => {
            var inputPlaceholder = $(element).attr("placeholder");

            if (inputPlaceholder === "...") {
                return true;
            }

            if (index === 0) {
                body.duration = inputPlaceholder;
            } else if (index === 1) {
                body.time = inputPlaceholder;
            } else if (index === 2) {
                var validInstructor;
                var instructorName = inputPlaceholder;
                instructorData = this.props.connector.getInstructorData()
                    .then((instructors) => {
                        validInstructor = instructorName in instructors;

                        if (validInstructor) {
                            body.instructorId = instructors[instructorName].id;
                        } else {
                            $(element).closest("td").hide().addClass("error-cell").fadeIn(800);
                        }
                    }).catch(error => console.error(error));
            }
        });

        console.log("Sending create new Private request to database...");
        Promise.all([instructorData])
            .then(() => this.props.connector.setPrivatesData(body))
            .then((res) => {
                console.log("Created new Private:", res);
                this.sortPrivates(res);
                this.numPrivates = this.getNumPrivates();
            }).catch(error => console.error(error));
        console.log("Sent create new Private request to database.");

        this.numPrivates = this.getNumPrivates();

        // Put 'remove' in the last cell of the row.
        $(event.target).closest("td").html("<a class='pure-button remove'>Remove</a>");

        // Rebind each 'remove'.
        $("#dynamicPrivate table .remove").click(this.removeRow.bind(this));

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Adds the input values or valid placeholder values from
     *  the input fields to the table.
     */
    addCells(cell, isFirstChild, removeInputRow) {
        var cellElement = $(cell).children().first();

        if (cellElement.is("input")) {
            if (cellElement.attr("placeholder") === "..." && removeInputRow) {
                $(cell).closest("tr").remove();

                return true;
            }

            // Input field data (or placeholder value for existing data).
            var newData = cellElement.val() || cellElement.attr("placeholder");
            newData = newData.replace(/^\s+|\s+$/, "");

            var isValidData = false;
            if (isFirstChild) {
                var reName = new RegExp(/^[A-Za-z\s]+$/);

                isValidData = reName.test(newData);
            } else if (newData.split(":").length === 2){
                var [hour, minute] = newData.split(":");
                var reHour = new RegExp(/^0?[0-9]|1[0-2]$/);
                var reMinute = new RegExp(/^([0-5][05]|60)$/);

                isValidData = reHour.test(hour) && reMinute.test(minute);
            } else {
                var reDuration = new RegExp(/^([0-5][05]|60)$/);
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

        // Re-title and re-bind 'Edit Private' button.
        editPrivate.unbind("click");
        editPrivate.html("Edit Private");
        editPrivate.click(this.editPrivate.bind(this));

        this.numPrivates = this.getNumPrivates();

        this.props.callback(this.privateLessons, this.props.controller, true);
        this.props.setChecklistQuantity("privates", this.numPrivates);
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

            for (var lessonIndex = 0; lessonIndex < instructor.length; lessonIndex++) {
                var lesson = instructor[lessonIndex];
                var time = lesson.time;

                if (time.split(":").length > 2) {
                    time = time.replace(/:[0-9][0-9]$/, "");
                }

                newTable += "<tr class='" + rowClass + "'>"
                    + "<td>" + instructorName + "</td>"
                    + "<td>" + time + "</td>"
                    + "<td>" + lesson.duration + "</td>"
                    + "</tr>";

                isOdd = !isOdd;
            }
        }

        $("#dynamicPrivate table tbody").append(newTable);

        this.colourTable();
        this.sizeTable();
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

        for (var instructor in this.privateLessons) {
            numPrivate += this.privateLessons[instructor].length;
        }

        return numPrivate;
    }

    /**
     * Sort object keys alphabetically into 'privateLessons'.
     */
    sortPrivates(privates) {
        Object.keys(privates).sort().forEach((key) => {
            if (key in this.privateLessons) {
                this.privateLessons[key].push(privates[key][0]);
            } else {
                this.privateLessons[key] = privates[key];
            }
        });
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
    initData: React.PropTypes.object.isRequired,
    connector: React.PropTypes.object.isRequired,
    controller: React.PropTypes.object.isRequired,
    setChecklistQuantity: React.PropTypes.func.isRequired
}

export default Private;
