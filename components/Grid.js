/**
 * FILENAME:    Grid.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the Grid class for the schedule content of the
 * lesson calendar web application. The Grid class is exported.
 *
 * The content is displayed here as a table, but the values will be generated in
 * another component.
 */

import React from 'react';
import GridFactory from './GridFactory';

class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.numLessons = 0;
        this.lessonQueue = [[], [], ["Hosing", "Assess"]];
        this.lessonCodes = {
            "02": "<div class='vertical-line vertical-line-center'></div>",
            "04": "<div class='vertical-line vertical-line-center'></div><div class='private-lesson-cell-right'></div>",
            "20": "<div class='vertical-line vertical-line-center'></div>",
            "22": "<div class='vertical-line vertical-line-center'></div>",
            "23": "<div class='vertical-line vertical-line-left'></div><div class='quarter-activity-right'>" + this.lessonQueue[2][0] + "</div>",
            "24": "<div class='vertical-line vertical-line-center'></div><div class='private-lesson-cell-right'></div>",
            "32": "<div class='quarter-activity-left'>" + this.lessonQueue[2][0] + "</div><div class='vertical-line vertical-line-right'></div>",
            "34": "<div class='quarter-activity-left'>" + this.lessonQueue[2][0] + "</div><div class='vertical-line vertical-line-right'></div><div class='private-lesson-cell-right'></div>",
            "40": "<div class='private-lesson-cell-left'></div><div class='vertical-line vertical-line-center'></div>",
            "42": "<div class='private-lesson-cell-left'></div><div class='vertical-line vertical-line-center'></div>",
            "43": "<div class='private-lesson-cell-left'></div><div class='vertical-line vertical-line-left'></div><div class='quarter-activity-right'>" + this.lessonQueue[2][0] + "</div>"
        };
    }

    componentDidMount() {
        // Default duration is 1.5 hours.
        this.props.lipData["duration"] = 1.5;

        $("#create-grid").click(this.generateGrid.bind(this));

        // Disable grid duration buttons.
        $("#duration0").addClass("pure-menu-selected");

        $("#duration0").click(() => {
            this.updateDuration(1.5, event.target);
        });
        $("#duration1").click(() => {
            this.updateDuration(2, event.target);
        });
        $("#duration2").click(() => {
            this.updateDuration(2.5, event.target);
        });

        // Hide modal on click outside of modal.
        $(window).click(() => {
            // Target is HTML object.
            if (event.target === $("#grid-modal")[0]) {
                $("#modal-grid-container").empty();

                $("#grid-modal").css({
                    "display": "none"
                });

                $(".vertical-line").css({
                    "height": "43px"
                });
                $(".vertical-line-center").css({
                    "margin": "-21.5px 0 0 50px"
                });
                $(".vertical-line-left").css({
                    "margin": "-8px 0 0 50px"
                });
                $(".vertical-line-right").css({
                    "margin": "-35px 0 0 50px"
                });
            }
        });
    }

    /**
     * Update the object duration value and display the
     * correct button as selected.
     */
    updateDuration(duration, target) {
        // Find previously selected duration and remove "selected" class.
        $(target).closest("ul").find(".pure-menu-selected").removeClass("pure-menu-selected");

        $(target).addClass("pure-menu-selected");

        this.props.lipData["duration"] = duration;

        // If a grid exists, generate a new one with the new duration.
        if ($("#grid-table ul li").length > 0) {
            this.generateGrid();
        }
    }

    /**
     * Display a notification if no Grids are created.
     * Display the number of instructors to be added to
     * create a Grid, given duration and lesson quantities
     * are constant.
     */
    noGridsNotification(duration, numInstructors, numHalfLessons, numThreeQuarterLessons) {
        var noGridsString = "No Grids were created<br />Add 0 Instructor";

        var instructorTime = duration * numInstructors;
        var lessonTime = 0.5 * numHalfLessons + 0.75 * numThreeQuarterLessons;

        var numAddInstructors = Math.ceil((lessonTime - instructorTime) / duration);

        var notification = noGridsString.replace(/[0-9]/, numAddInstructors);

        if (numAddInstructors !== 1) {
            notification = notification.concat("s");
        }

        $("#nogrids-notification").empty().hide();
        $("#nogrids-notification").append(notification);
        $("#nogrids-notification").fadeIn(800);
    }

    /**
     * Returns an HTML to style a table cell based on
     * code for split cell.
     */
    getSplitCell(code) {
        if (this.lessonQueue[2].length === 2 && this.lessonCodes[code].includes("quarter-activity")) {
            this.lessonQueue[2].splice(0, 1);
        }

        return this.lessonCodes[code];
    }

    /**
     * Creates an array of lessons, divided to two arrays:
     * 1/2 hour & 3/4 hour.
     */
    generateLessonQueue() {
        // Reset lesson queue.
        this.lessonQueue = [[], [], ["Hosing", "Assess"]];

        // Lessons of 3/4 hour length.
        var threeQuarterLessons = [
            "Level 6",
            "Level 7",
            "Level 8",
            "Level 9",
            "Level 10",
            "Basics I",
            "Basics II",
            "Strokes"
        ];

        for (var key in this.props.lipData.lessons) {
            if (key === "half" || key === "threequater") {
                continue;
            }

            var value = this.props.lipData.lessons[key];
            var keyArray = Array(value).fill(key);

            if (threeQuarterLessons.includes(key)) {
                this.lessonQueue[1] = this.lessonQueue[1].concat(keyArray);
            } else {
                this.lessonQueue[0] = this.lessonQueue[0].concat(keyArray);
            }
        }
    }

    /**
     * Sums the number of preferred lessons.
     */
    getPreferenceLength(newInstructor) {
        return this.props.lipData.instructorPreferences[newInstructor].reduce(function(sum, next) {
            return sum + next.length;
        }, 0);
    }

    /**
     * Randomizes the contents of the array.
     */
    randomizeArray(array) {
        var i, tmp;
        var l = array.length;

        // While there remain elements to shuffle.
        while (l > 0) {
            // Pick a remaining element.
            i = Math.floor(Math.random() * l--);

            // Swap with the current element.
            tmp = array[l];
            array[l] = array[i];
            array[i] = tmp;
        }

        return array;
    }

    /**
     * Orders the instructors by the length of their
     * preferences, in ascending order.
     * Instructors with empty preference objects are
     * appended randomly to the array.
     */
    orderInstructorsByPreferencesSize() {
        var newInstructorOrder = [];
        var instructorPreferenceLengths = [];

        for (var instructor in this.props.lipData.instructorPreferences) {

            var preferenceSize = this.getPreferenceLength(instructor);

            instructorPreferenceLengths.push([instructor, preferenceSize]);
        }

        instructorPreferenceLengths.sort((current, previous) => {
            return current[1] - previous[1];
        });

        for (var i = 0; i < instructorPreferenceLengths.length; i++) {
            newInstructorOrder.push(instructorPreferenceLengths[i][0]);
        }

        var noPreferenceInstructors = this.props.lipData.instructors.filter((instructor) => {
            return !newInstructorOrder.includes(instructor);
        });

        var randomOrderInstructors = this.randomizeArray(noPreferenceInstructors);

        // Append instructors without preferences' index in random order.
        return newInstructorOrder.concat(randomOrderInstructors);;
    }

    /**
     * Assigns lessons to slots based on the instructors' preferences
     */
    assignLessons(instructor, index, q) {
        var lessonCode = instructor[index];
        var prefs = this.props.lipData.instructorPreferences;

        // If the slot locarion is a code (string), it isn't a lesson.
        if (typeof lessonCode === "string") {
            instructor[index] = this.getSplitCell(lessonCode);

            return q;
        }

        // There are no stand alone '3' cells.
        if (lessonCode === 1 || lessonCode === 2) {
            var prefLessonsByCode;
            var assigned = false;
            var instructorName = instructor[0];
            var typedLessons = q[lessonCode - 1];

            if (lessonCode === 1) {
                prefLessonsByCode = prefs[instructorName][0].concat(prefs[instructorName][1]).concat(prefs[instructorName][2]);
            } else if (lessonCode === 2) {
                prefLessonsByCode = prefs[instructorName][3].concat(prefs[instructorName][4]);
            }

            if (instructorName in prefs) {
                for (var lesson = 0; lesson < typedLessons.length; lesson++) {
                    if (prefLessonsByCode.includes(typedLessons[lesson])) {
                        lessonCode = typedLessons.splice(lesson, 1)[0];

                        assigned = true;
                        break;
                    }
                }
            }

            // No preferred lesson is found.
            if (!assigned) {
                lessonCode = typedLessons.splice(0, 1)[0];
            }
        } else if (lessonCode === 4) {
            lessonCode = "Private";
        } else {
            // Default is an empty cell.
            lessonCode = "";
        }

        instructor[index] = lessonCode;
        q[lessonCode - 1] = typedLessons;

        return q;
    }

    /*
     * Gets an array generated by the GridFactory class.
     * Modifies the array to map to Red Cross levels.
     */
    generateGridArrays() {
        var newGrids = GridFactory(this.props.lipData);
        var instructorOrder = this.orderInstructorsByPreferencesSize();

        // Set allocated lessons slots to Red Cross & private lessons.
        for (var grid = 0; grid < newGrids.length; grid++) {
            var queue = jQuery.extend(true, [], this.lessonQueue);

            for (var slot = 1; slot < newGrids[grid][1].length; slot++) {
                for (var instructor = 1; instructor < newGrids[grid].length; instructor++) {

                    // For object-based grids, the inner for loop isn't necessary.
                    for (var instructorRow = 1; instructorRow < newGrids[grid].length; instructorRow++) {
                        if (newGrids[grid][instructorRow][0] === instructorOrder[instructor - 1]) {
                            this.assignLessons(newGrids[grid][instructorRow], slot, queue);
                            break;
                        }
                    }
                }
            }

            if (this.lessonQueue[2].length < 2) {
                this.lessonQueue[2].unshift("Hosing");
            }
        }

        return newGrids;
    }

    /*
     * Transforms an array to a PureCSS table.
     * Note, the first row of the array is considered as the Header of the table.
     */
    generateGrid() {
        // Hide tutorial message, error notification, & current grids.
        $("#grid-footer").css({
            "display": "none"
        });
        $("#grid-table ul").empty();

        // Create the queue of lessons.
        this.generateLessonQueue();

        // Get base array to represent grid.
        var gridArrays = this.generateGridArrays();

        if (gridArrays.length === 0) {
            this.noGridsNotification(
                this.props.lipData.duration,
                this.props.lipData.instructors.length,
                this.props.lipData.lessons.half,
                this.props.lipData.lessons.threequater
            );
            return;
        } else {
            $("#nogrids-notification").hide();
        }

        // Display buttons appropriately.
        for (var duration = 0; duration < 3; duration++) {
            if (duration === 2 * this.props.lipData["duration"] - 3) {
                $("#duration".concat(duration)).removeClass("pure-menu-selected pure-menu-disabled").addClass("pure-menu-selected");
            } else {
                $("#duration".concat(duration)).addClass("pure-menu-disabled");
            }
        }

        // Transform array to HTML table with PureCSS styling
        for (var gridIndex = 0; gridIndex < gridArrays.length; gridIndex++) {
            var newTable = "<li class='pure-menu-item'><a class='pure-menu-link'><table class='pure-table'><thead>";
            for (var instructor = 0; instructor < gridArrays[gridIndex].length; instructor++) {
                newTable += "<tr" + ((instructor % 2 === 0) ? (instructor === 0 ? "" : " class='table-even'") : " class='table-odd'") + ">";
                for (var slot = 0; slot < 2 * this.props.lipData["duration"] + 1; slot++) {
                    if (instructor === 0) {
                        newTable += "<th>" + gridArrays[gridIndex][instructor][slot] + "</th>";
                    } else {
                        if (slot > 0 &&
                            (
                                (gridArrays[gridIndex][instructor][slot][0] === "<" && this.lessonQueue[1].includes(gridArrays[gridIndex][instructor][slot - 1]))
                                ||
                                (gridArrays[gridIndex][instructor][slot - 1][0] === "<" && this.lessonQueue[1].includes(gridArrays[gridIndex][instructor][slot]))
                             )
                        ) {
                            newTable += "<td class='no-border'>" + gridArrays[gridIndex][instructor][slot] + "</td>";
                        } else if (gridArrays[gridIndex][instructor][slot].includes("private-lesson-cell-left")) {
                            newTable += "<td class='no-border half-private-lesson-cell-left'>" + gridArrays[gridIndex][instructor][slot] + "</td>";
                        } else if (gridArrays[gridIndex][instructor][slot].includes("private-lesson-cell-right")) {
                            newTable += "<td class='half-private-lesson-cell-right'>" + gridArrays[gridIndex][instructor][slot] + "</td>";
                        } else if (gridArrays[gridIndex][instructor][slot] === "Private") {
                            newTable += "<td class='private-lesson-cell" + ((gridArrays[gridIndex][instructor][slot - 1].includes("private-lesson-cell-right")) ? " no-border is-left" : "") + "'>Private</td>";
                        } else {
                            newTable += "<td" + ((slot === 0) ? " class='first-column'" : "") + ">" + gridArrays[gridIndex][instructor][slot] + "</td>";
                        }
                    }
                }

                newTable += "</tr>";

                if (instructor === 0) {
                    newTable += "</thead><tbody>";
                }
            }

            $("#grid-table ul").append(newTable + "</tbody></table></a></li>");

            // hover
            $(".table-odd").hover(function() {
                $(".vertical-line").addClass("vertical-line-hover");
            }, function() {
                $(".vertical-line").removeClass("vertical-line-hover");
            });
        }

        // Place table and horizontal-scrolling list properly in section.
        $("#grid-table").css({
            "width": (128 * (2 * this.props.lipData["duration"] + 1.5)) + "px"
        });

        // Eliminate conflict with the GridChecklist.
        if (this.props.lipData.instructors.length > 3) {
             $("#dynamicGrid").css({
                 "height": ($(window).height() - 55 + (40 * (this.props.lipData.instructors.length - 3))) + "px"
             });
        }

        // Click to make modal of list element
        $("#grid-table a").click(() => {
            $("#grid-modal").css({
                "display": "block"
            });

            $(".vertical-line").css({
                "height": "63px"
            });
            $(".vertical-line-center").css({
                "margin": "-31.5px 0 0 50px"
            });
            $(".vertical-line-left").css({
                "margin": "-18px 0 0 40px"
            });
            $(".vertical-line-right").css({
                "margin": "-45px 0 0 55px"
            });

            $("#modal-grid-container").append($(event.target).closest("table").clone());
        });
    }

    render() {
        return (
            <div id="grid-container">
                <h2 className="content-head is-right">
                    The grid
                </h2>
                <div className="content-section-description is-right right-text">
                    Generate a lesson calendar.
                    <ul className="content-section-explanation">
                        <li>Select the duration</li>
                        <li>Cycle through the possible grids</li>
                        <li>Inspect each grid</li>
                    </ul>
                    <a id="create-grid" className="pure-button">
                        Create Grid
                    </a>
                    <p id="nogrids-notification"></p>
                </div>
                <div id="timeslot-duration-container" className="pure-menu pure-menu-horizontal">
                    <a className="pure-menu-heading">Time Slot Duration</a>
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item"><a id="duration0" className="pure-menu-link">1&frac12; hours</a></li>
                        <li className="pure-menu-item"><a id="duration1" className="pure-menu-link">2 hours</a></li>
                        <li className="pure-menu-item"><a id="duration2" className="pure-menu-link">2&frac12; hours</a></li>
                    </ul>
                </div>
                <div id="grid-table" className="pure-menu pure-menu-horizontal pure-menu-scrollable">
                    <ul className="pure-menu-list"></ul>
                </div>
                <div id="dynamicGridChecklist"></div>
                <div id="grid-modal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">The Grid</div>
                        <div id="modal-grid-container" className="modal-body"></div>
                        <div className="modal-footer">&nbsp;</div>
                    </div>
                </div>
                <div id="grid-footer" className="content-section-footer">
                    <h2 className="content-head">
                        <font color="#2d3e50">Step #4:</font>
                    </h2>
                    <font color="#333">
                        Create a grid, and I&#039;ll  get cooking.
                    </font>
                </div>
            </div>
        );
    }
}

Grid.propTypes =  {
    lipData: React.PropTypes.object.isRequired
}

export default Grid;
