/**
 * FILENAME:    Private.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the Private class for the collection
 *  of private lessons for the web application.
 * The Private class is exported.
 */

import React from 'react';

class Private extends React.Component {
    constructor(props) {
        super(props);

        this.privateLessons = {};
    }

    componentDidMount() {
        this.sortPrivates([this.props.initData]);
        this.generatePrivate();

        this.props.callback(this.privateLessons, this.props.controller, false);
        this.props.setChecklistQuantity("privates", this.getNumPrivates());

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
     * Places the private table in a state where the
     *  contents of the table can be changed.
     * The data in the input field will replace any data
     *  that was previously in the table cell.
     * Leaving any input field empty will not replace the
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
     * Removes the row of the table of a clicked
     *  'remove' button.
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
                    var privatesId = privateInstructor[i].id;

                    this.removePrivate(privatesId, instructorName, i);
                }
            }
        }

        removedRow.remove();

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Verify contents of inputs and commit to the table.
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
     * Add a row to the table on 'add' button click.
     */
    addRow() {
        var target = event.target;
        var isValid = this.addTableContents(false);

        if (!isValid) {
            return;
        }

        var addedRow = $(target).closest("tr");
        var addedData = addedRow.find("td");

        this.inputifyRows();

        var isDuplicate = this.checkDuplicates(addedData);
        if (isDuplicate) {
            addedRow.hide().addClass("error-cell").fadeIn(800);

            return;
        }

        // Add row to privateLessons object.
        var instructorName;
        var instructorData;
        var validInstructor;
        var body = {};
        $(addedData.get().reverse()).each((index, element) => {
            var inputPlaceholder = $(element).find("input").attr("placeholder");

            // Unused cell or remove button cell.
            if (inputPlaceholder === "..." || index === 0) {
                return true;
            }

            if (index === 1) {
                body.duration = inputPlaceholder;
            } else if (index === 2) {
                body.time = inputPlaceholder;
            } else if (index === 3) {
                validInstructor = false;
                instructorName = inputPlaceholder;

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

        instructorData.then(() => {
                // If instructor is invalid, reject promise and don't add new row or remove button...
                if (!validInstructor) {
                    return Promise.reject("Private Instructor \"" + instructorName + "\" is not in the Instructors table.");
                }
            })
            .then(() => this.createPrivate(body))
            .then((res) => {
                // Store id in HTMl.
                $("#dynamicPrivate table tr:last").attr("data-privates-id", res[instructorName][0].id);

                // Put 'remove' in the last cell of the row.
                $(target).closest("td").html("<a class='pure-button remove'>Remove</a>");

                this.addInputRow();
                this.inputifyRows();
            }).catch(error => console.error(error));

        // Rebind each 'remove'.
        $("#dynamicPrivate table .remove").click(this.removeRow.bind(this));

        this.colourTable();
        this.sizeTable();
    }

    /**
     * Adds the input values or valid placeholder values
     *  from the input fields to the table.
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
     * Empty inputs will leave the cell with its
     *  original data.
     */
    finishEditingPrivate() {
        var tableRows;
        var newInstructorId;
        var newInstructorIds = [];
        var editPrivate = $("#dynamicPrivate .ribbon-section-description a");

        var isValid = this.addTableContents(true);

        if (!isValid) {
            return;
        }

        // Remove 'Modify' column.
        tableRows = $("#dynamicPrivate tr");

        // Update class object with new values.
        tableRows.each((rowIndex, row) => {
            var index;
            var _private;
            var pirvateId;
            var instructorName;

            // Remove 'Modify' column & skip header row.
            if (rowIndex === 0) {
                $(row).children("th").last().remove();

                return true;
            } else {
                $(row).children("td").last().remove();
            }

            pirvateId = $(row).attr("data-privates-id");

            [_private, instructorName, index] = this.findPrivateById(pirvateId);

            $(row).children("td").each((cellIndex, element) => {
                var cellText = $(element).text();

                if (cellText !== "...") {
                    if (cellIndex === 0) {
                        if (cellText in this.privateLessons) {
                            this.privateLessons[cellText].push(_private);
                        } else {
                            this.privateLessons[cellText] = [_private];
                        }

                        this.privateLessons[instructorName].splice(index, 1);

                        newInstructorId = this.props.connector.getInstructorData("db")
                            .then((res) => {
                                for (var instructorName in res) {
                                    if (instructorName === cellText) {
                                        _private.instructorId = res[instructorName].id;
                                    }
                                }
                            }).catch(error => console.error(error));

                        newInstructorIds.push(newInstructorId);
                    } else if (cellIndex === 1) {
                        if (cellText !== _private.time) {
                            _private.time = cellText;
                        }
                    } else if (cellIndex === 2) {
                        if (cellText !== _private.duration) {
                            _private.duration = cellText;
                        }
                    }
                }
            });
        });

        Promise.all(newInstructorIds)
            .then(() => {
                this.props.callback(this.privateLessons, this.props.controller, true);
                this.props.setChecklistQuantity("privates", this.getNumPrivates());
            }).catch(error => console.error(error));

        // Re-title and re-bind 'Edit Private' button.
        editPrivate.unbind("click");
        editPrivate.html("Edit Private");
        editPrivate.click(this.editPrivate.bind(this));
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
                var privatesId = lesson.id;

                if (time.split(":").length > 2) {
                    time = time.replace(/:[0-9][0-9]$/, "");
                }

                newTable += "<tr class='" + rowClass + "' data-privates-id='" + privatesId + "'>"
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

    /*
     * Add an instructor to the database.
     */
    createPrivate(body) {
        var promise;

        console.log("Sending create new Private request to database...");
        promise = this.props.connector.setPrivatesData(body)
            .then((res) => {
                console.log("Created new Private:", res);
                this.sortPrivates([this.privateLessons, res]);

                return res;
            }).catch(error => console.error(error));
        console.log("Sent create new Private request to database.");

        return promise;
    }

    /*
     * Remove an instructor from the database.
     */
    removePrivate(id, instructorName, sliceIndex) {
        var promise;

        console.log("Sending delete Private request to database...");
        promise = this.props.connector.deletePrivatesData(id)
            .then((res) => {
                console.log("Deleted Private:", res);
                this.privateLessons[instructorName].splice(sliceIndex, 1);
            }).catch(error => console.error(error));
        console.log("Sent delete Private request to database.");

        return promise;
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
     * Find the private object & instructor name by id.
     */
    findPrivateById(id) {
        var privatesId = parseInt(id, 10);

        for (var instructorName in this.privateLessons) {
            var _private = this.privateLessons[instructorName];

            for (var i = 0; i < _private.length; i++) {
                if (_private[i].id === privatesId) {
                    return [_private[i], instructorName, i];
                }
            }
        }

        return [false, ""];
    }

    /**
     * Sort object keys alphabetically into 'privateLessons'.
     */
    sortPrivates(privates) {
        var obj = {};
        var allKeys = [];

        for (var i = 0; i < privates.length; i++) {
            allKeys = allKeys.concat(Object.keys(privates[i]));
        }

        // Eliminate duplicate keys.
        allKeys = Array.from(new Set(allKeys));

        allKeys.sort().forEach((key) => {
            obj[key] = [];

            for (var i = 0; i < privates.length; i++) {
                if (key in privates[i]) {
                    var sortedTimes = this.sortPrivatesByTime(privates[i][key]);
                    obj[key] = obj[key].concat(sortedTimes);
                }
            }
        });

        this.privateLessons = obj;
    }

    /**
     * Sort object by time attribute.
     */
    sortPrivatesByTime(privates) {
        if (privates.length === 1) {
            return privates
        }

        var obj = [];
        var allTimes = [];

        for (var i = 0; i < privates.length; i++) {
            allTimes.push(privates[i].time);
        }

        // Eliminate duplicate keys.
        allTimes = Array.from(new Set(allTimes));

        allTimes.sort().forEach((time) => {
            for (var i = 0; i < privates.length; i++) {
                if (time === privates[i].time) {
                    obj.push(privates[i]);
                }
            }
        });

        return obj;
    }

    checkDuplicates(newData) {
        var existingTime;
        var existingInstructor;

        newData.each((index, element) => {
            var cellText = $(element).find("input").attr("placeholder");

            if (!cellText || cellText === "...") {
                return true;
            }

            if (index === 0) {
                if (cellText in this.privateLessons) {
                    existingInstructor = cellText;
                }
            } else if (index === 1) {
                var placeholderMilliseconds = cellText + ":00";

                if (existingInstructor) {
                    var privates = this.privateLessons[existingInstructor];
                    console.log(privates);

                    for (var i = 0; i < privates.length; i++) {
                        if (privates[i].time === placeholderMilliseconds) {
                            existingTime = placeholderMilliseconds;
                        }
                    }
                }
            }
        });

        return existingInstructor && existingTime;
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
