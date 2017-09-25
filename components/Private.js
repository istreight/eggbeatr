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
        if (sessionStorage.getItem("private") && sessionStorage.getItem("private") !== "{}") {
            this.privateLessons = JSON.parse(sessionStorage.getItem("private"));

            this.props.gridChecklist.checkComplete($("#private-checklist"), this.numPrivate);
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

        this.props.callback(this.privateLessons, this.props.lipReader);

        this.numPrivate = this.getNumPrivates();

        this.generatePrivate();

        this.props.gridChecklist.checkComplete($("#private-checklist"), this.numPrivate);

        // Make component size of window.
        $("#dynamicPrivate").css({
            "height": ($(window).height() - 55) + "px"
        });

        $("#edit-private").click(this.editPrivate.bind(this));

        // Assign text in drop down to 'privateLessons'.
        var that = this;
        $("#private-table td li a").click(function() {
            // Modify displayed text.
            var newIncludeValue = $(this).text();
            var includeAnchor = $(this).parents("li").eq(1).find("a")[0];
            $(includeAnchor).text(newIncludeValue);

            // Update privateLessons.
            var instructor;
            var timeSlot;
            var row = $(this).closest("tr").children();
            row.each(function(index, element) {
                if (index === 0) {
                    instructor = that.privateLessons[$(element).text()];
                    return instructor !== undefined;
                } else if (index === 1) {
                    timeSlot = instructor[$(element).text()];
                    return timeSlot !== undefined;
                } else {
                    if ($(element).children().length === 0) {
                        timeSlot[0] = $(element).text();
                    } else {
                        timeSlot[1] = $(element).find("a").eq(0).text();
                    }
                }
            });

            that.numPrivate = that.getNumPrivates();

            that.props.gridChecklist.checkComplete($("#private-checklist"), that.numPrivate);

            if (timeSlot !== undefined) {
                that.props.callback(that.privateLessons, that.props.lipReader);
            }
        });

        // Link tutorital button to next section.
        $("#private-next").click(function() {
            $("body").on("mousewheel DOMMouseScroll", function() {
                return false;
            });
            $("#grid-footer").css({
                "display": "block"
            });

            // Fade out, since 'private-footer' is visible, hide after animation.
            $("#private-footer").fadeOut(1000);

            $("html, body").animate({
                scrollTop: $("#dynamicGrid").offset().top - 57
            }, 1600, function() {
                $("body").off("mousewheel DOMMouseScroll");
                $("#private-footer").css({
                    "display": "none"
                });
            });
        });
    }

    getNumPrivates() {
        var numPrivate = 0;

        for (var instructor in this.privateLessons) {
            for (var timeSlot in this.privateLessons[instructor]) {
                if (this.privateLessons[instructor][timeSlot][1] === "Yes") {
                    numPrivate++;
                }
            }
        }

        return numPrivate;
    }

    /*
     * Appends a row of input fields to the private table.
     */
    inputifyRows() {
        var privateTable = $("#private-table");
        var numRows = privateTable.find("tr").length - 1;

        // Append row of input fields and 'add' button.
        privateTable.append("<tr " + ((numRows % 2 == 0) ? " class='table-odd'" : " class='table-even'") + "><td><td></td><td></td><td><div></div></td><td class='is-center'><a class='pure-button add'>Add</a></td></tr>");

        // Bind 'Add' buttons for new rows.
        privateTable.find(".add").click(this.addRow.bind(this));

        // Replace text with input fields, customized placeholder based on text.
        privateTable.find("td").each(function() {
            var firstChild = $(this).children().eq(0);

            if (firstChild.is("input")) {
                var placeholder = firstChild.attr("placeholder");
                $(this).empty().append("<input type='text' placeholder='" + placeholder + "'>");
            } else if (!(firstChild.is("a") || firstChild.is("div"))) {
                var placeholder = $(this).text() || "...";
                $(this).empty().append("<input type='text' placeholder='" + placeholder + "'>");
            }
        });
    }

    /*
     * Resets the table to appropriate colour scheme.
     */
    recolourTable() {
        // Recolour rows.
        $("#private-table").find("tr").each(function(index, element) {
            if (index === 0) {
                // Skip header row.
                return true;
            }

            $(element).addClass((index % 2 === 1) ? "table-odd" : "table-even");
            $(element).removeClass((index % 2 === 0) ? "table-odd" : "table-even");
        });
    }

    /*
     * Places the private table in a state where the contents of the table
     * can be changed.
     * The data in the input field will replace any data that was previously in
     * the table cell. Leaving any input field empty will not replace the
     * original data.
     */
    editPrivate() {
        $("#edit-private").empty().append("Finish Editing").unbind("click").click(this.finishEditingPrivate.bind(this));

        $("#private-table thead tr").append("<th class='is-center'>Modify</th>");
        $("#private-table tbody tr").append("<td class='is-center'><a class='pure-button remove'>Remove</a></td>");

        var that = this;
        $("#private-table .remove").click(function() {
            // Remove from 'privateLessons' object.
            var instructorName = $(this.closest("tr")).find("input").eq(0).attr("placeholder");
            delete that.privateLessons[instructorName];

            that.removePrivateRow(this);
        });

        this.inputifyRows();
    }

    /*
     * Removes the row of the table of a clicked 'remove' button.
     * Moves the 'private' table down the page.
     */
    removePrivateRow(that) {
        // Increase size of section.
        if ($("#private-table tr").length > 4) {
            $("#dynamicPrivate").css({
                "height": ($("#dynamicPrivate").height() + 30) + "px"
            });
        }

        that.closest("tr").remove();

        // Reposition table based on number of rows.
        if ($("#private-table tr").length < 5) {
            $("#private-table").css({
                "padding": "0 0 " + (parseInt($("#private-table").css("padding-bottom").replace("px", "")) - 8.75) + "px 0"
            });
        }

        this.recolourTable();
    }

    /*
     * Add a row to the table when the 'add' button is clicked.
     * Moves the 'private' table up the page.
     */
    addRow() {
        // Increase size of section.
        if ($("#private-table tbody tr").length > 5) {
            $("#dynamicPrivate").css({
                "height": ($("#dynamicPrivate").height() + 150) + "px"
            });
        }

        var newLessonInputs = $("#private-table tbody tr").last().find("input");
        var newInstructor = newLessonInputs.eq(0).val();
        var newTimeSlot = newLessonInputs.eq(1).val();
        var newDuration = newLessonInputs.eq(2).val();

        // Add row to 'privateLessons' object.
        var instructor = this.privateLessons[newInstructor];
        if (instructor !== undefined) {
            if (instructor[newTimeSlot] !== undefined) {
                var newLessonRow = $(newLessonInputs).closest("tr");
                newLessonRow.hide().addClass("error-table").fadeIn(800);

                return;
            } else {
                // "Include" value defaults to 'No'.
                instructor[newTimeSlot] = [newDuration, "No"];
            }
        } else {
            this.privateLessons[newInstructor] = {
                [newTimeSlot]: [newDuration, "No"]
            };
        }

        this.numPrivate = this.getNumPrivates();

        $(newLessonInputs).closest("tr").removeClass("error-table");

        // Add row to table.
        var that = this;
        $("#private-table tbody tr td").each(function() {
            that.addCells(this, false);
        });

        // Place the 'remove' button in the last cell of the row.
        var buttonCell = $("#private-table tbody tr td").last();
        $(buttonCell).empty().append("<a class='pure-button remove'>Remove</a>");
        $(buttonCell).find("a").click(function() {
            // Remove from 'privateLessons' object.
            var lessonRow = $(this).closest("tr").find("input");
            var instructor = lessonRow.eq(0).attr("placeholder");
            var timeSlot = lessonRow.eq(1).attr("placeholder");
            delete that.privateLessons[instructor][timeSlot];

            that.removePrivateRow(this);
        });

        // Append new row to allow multiple additions.
        this.inputifyRows();

        this.recolourTable();
    }

    /*
     * Adds a set of cells in a row when the 'add' button,
     * with data from the input fields.
     * Moves the 'private' table up the page.
     */
    addCells(that, removeInputRow) {
        var firstChild = $(that).children().eq(0);

        if (firstChild.is("input")) {
            // Remove unfilled input row.
            if (firstChild.attr("placeholder") === "..." && removeInputRow) {
                $(that).parent().remove();
                return true;
            }

            // Append input field data (or placeholder value) to table.
            var newData = firstChild.val() || firstChild.attr("placeholder");
            newData = newData.replace(/^\s+|\s+$/g, "");

            var isValidData = false;
            if ($(that).is(":first-child")) {
                isValidData = /^[A-Za-z\s]+$/.test(newData);
            } else if (newData.split(":").length === 2){
                var [hour, minutes] = newData.split(":");

                isValidData = /^(0?[0-9]|1[0-2])$/.test(hour) && /^(0?[0-9]|[1-5][0-9])$/.test(minutes);
            } else {
                isValidData = /^([1-9][0-9]*)$/.test(newData);
            }

            if (isValidData) {
                $(that).empty().append(newData);
                $(that).removeClass("error-table");
            } else {
                $(that).hide().addClass("error-table").fadeIn(800);
                firstChild.val("");
            }

            return isValidData;
        } else if (firstChild.is("div") && !$(that).children(":first").text()) {
            // Place a dropdown menu in the 4th column with CSS styling.
            $(that).empty().append(
                "<div class='pure-menu pure-menu-horizontal'><ul class='pure-menu-list'><li class='pure-menu-item pure-menu-has-children pure-menu-allow-hover'><a class='pure-menu-link menu-odd'>No</a><ul class='pure-menu-children'><li class='pure-menu-item'><a class='pure-menu-link'>Yes</a></li><li class='pure-menu-item'><a class='pure-menu-link'>No</a></li></ul></li></ul></div>"
            );

            // Bind 'include' buttons to show selected option.
            var _this = this;
            var newIncludeAnchor = $(that).find("a");
            newIncludeAnchor.click(function() {
                // Set visible string.
                var newIncludeValue = $(this).text();
                var includeAnchor = $(this).parents("li").eq(1).find("a")[0];
                $(includeAnchor).text(newIncludeValue);

                // Update privateLessons.
                var instructor;
                var timeSlot;
                var row = $(this).closest("tr").children();
                row.each(function(index, element) {
                    if (index === 0) {
                        instructor = _this.privateLessons[$(element).text()];
                        return instructor !== undefined;
                    } else if (index === 1) {
                        timeSlot = instructor[$(element).text()];
                        return timeSlot !== undefined;
                    } else {
                        if ($(element).children().length === 0) {
                            timeSlot[0] = $(element).text();
                        } else {
                            timeSlot[1] = $(element).find("a").eq(0).text();
                        }
                    }
                });

                if (timeSlot !== undefined) {
                    _this.props.callback(_this.privateLessons, _this.props.lipReader);
                }
            });
        }

        return true;
    }

    /*
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its original data.
     */
    finishEditingPrivate() {
        var privateTable = $("#private-table");

        // Remove 'Modify' column.
        privateTable.find("tr").each((index, element) => {
            if (index === 0) {
                $(element).children("th").last().remove();
            } else {
                $(element).children("td").last().remove();
            }
        });

        // Add row to table.
        var that = this;
        var addedCells = true;
        privateTable.find("td").each(function() {
            addedCells = that.addCells(this, true) && addedCells;
        });
        if (!addedCells) {
            this.editPrivate();
            return;
        }

        $("#edit-private").empty().append("Edit Private").unbind("click").click(this.editPrivate.bind(this));

        // Update privateLessons.
        var instructor;
        var timeSlot;
        var row = $("#private-table").find("tbody").find("tr").children();
        row.each(function(index, element) {
            if (index % 4 === 0) {
                instructor = that.privateLessons[$(element).text()];
                return instructor !== undefined;
            } else if (index % 4 === 1) {
                timeSlot = instructor[$(element).text()];
                return timeSlot !== undefined;
            } else {
                if ($(element).children().length === 0) {
                    timeSlot[0] = $(element).text();
                } else {
                    timeSlot[1] = $(element).find("a").eq(0).text();
                }
            }
        });

        this.numPrivate = this.getNumPrivates();

        this.props.gridChecklist.checkComplete($("#private-checklist"), this.numPrivate);

        this.props.callback(this.privateLessons, this.props.lipReader);
    }

    /*
     * Transforms an array to a PureCSS table.
     * Note, the first row of the array is considered as the first row of the
     * table. The Header is defined statically within render().
     */
    generatePrivate() {
        var gridArray = [];
        for (var instructor in this.privateLessons) {
            var privateLessons = this.privateLessons[instructor];
            var i = 0;
            for (var timeSlot in privateLessons) {
                var lessonDetails = privateLessons[timeSlot];

                gridArray.push([
                    instructor,
                    timeSlot,
                    lessonDetails[0],
                    "<div class='pure-menu pure-menu-horizontal'><ul class='pure-menu-list'><li class='pure-menu-item pure-menu-has-children pure-menu-allow-hover'><a class='pure-menu-link menu-odd'>" + lessonDetails[1] + "</a><ul class='pure-menu-children'><li class='pure-menu-item'><a  class='pure-menu-link'>Yes</a></li><li class='pure-menu-item'><a  class='pure-menu-link'>No</a></li></ul></li></div>"
                ]);
            }
            i++;
        }

        // Transform array to HTML table, with PureCSS styling.
        var newTable = "";
        for (var privateLesson = 0; privateLesson < gridArray.length; privateLesson++) {
            newTable += "<tr"  + ((privateLesson % 2 == 0) ? " class='table-odd'" : " class='table-even'") + ">";
            for (var slot = 0; slot < gridArray[0].length; slot++) {
                newTable += "<td>" + gridArray[privateLesson][slot] + "</td>";
            }
            newTable += "</tr>";
        }

        $("#private-table tbody").append(newTable);
    }

    render() {
        return (
                <div id="private-container" className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
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
                        <a id="edit-private" className="pure-button">
                            Edit Private
                        </a>
                    </div>
                    <div id="private-table-container">
                        <table id="private-table" className="pure-table">
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
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div id="private-footer" className="ribbon-section-footer">
                        <h2 className="content-head content-head-ribbon">
                            <font color="white">Step #3:</font>
                        </h2>
                        <font color="#ddd">
                            List any private lessons occuring during this set.
                        </font>
                        <a id="private-next" className="pure-button pure-button-primary">
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
