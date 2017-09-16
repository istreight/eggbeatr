/**
 * FILENAME:    Grid.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the Gird class for the schedule content of the
 * lesson calendar web application. The Grid class is exported.
 *
 * The content is displayed here as a table, but the values will be generated in
 * another component.
 *
 *
 * CHANGE LOG:
 *  18/10/16:
 *              Added div-tag to simulate placement of table.
 *
 *  22/10/16:
 *              Added button to generate grid.
 *              Added table, dynamically appended via button.
 *
 *  25/10/16:
 *              Modified dynamic CSS for the grid table.
 *              Added section description.
 *
 *  31/10/16:
 *              Added horizontal sliding list of generated grids.
 *              Improved changing grid duration.
 *              Moved the list of grids to align center-right & position by size.
 *
 *  06/11/16:
 *              Placed grid section at bottom of web app.
 *              Added modal option for viewing grids after generation.
 *
 *  09/11/16:
 *              Removed alterGrid.
 *              Added cut-off of grid duration based on props attribute.
 *              Moved CSS styling for 'grid-table' width into generateGrid.
 *
 *  16/11/16:
 *              Added notification if no grids are created.
 *
 *  04/12/16:
 *              Added randomly sorted list for assigning lessons to instructors.
 *
 *  07/12/16:
 *              Added lesson selection based on preferences.
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
        // Make component size of window.
        $("#dynamicGrid").css({
            "height": ($(window).height() - 55) + "px"
        });

        // Default duration is 1.5 hours.
        this.props.lipData["duration"] = 1.5;

        $("#create-grid").click(this.generateGrid.bind(this));

        // Disable grid duration buttons.
        $("#duration0").addClass("pure-menu-disabled").click(function() {
            this.props.lipData["duration"] = 1.5;
            this.generateGrid();
        }.bind(this));
        $("#duration1").addClass("pure-menu-disabled").click(function() {
            this.props.lipData["duration"] = 2;
            this.generateGrid();
        }.bind(this));
        $("#duration2").addClass("pure-menu-disabled").click(function() {
            this.props.lipData["duration"] = 2.5;
            this.generateGrid();
        }.bind(this));

        // Hide modal on click outside of modal.
        $(window).click(function(e) {
            if (e.target === $("#grid-modal")[0]) {
                $("#modal-grid-container").empty();
                $("#grid-modal").css({
                    "display": "none"
                });
                $(".vertical-line-center").css({
                    "height": "43px",
                    "margin": "-21.5px 0 0 50px"
                });
                $(".vertical-line-left").css({
                    "height": "43px",
                    "margin": "-8px 0 0 50px"
                });
                $(".vertical-line-right").css({
                    "height": "43px",
                    "margin": "-35px 0 0 50px"
                });
            }
        });
    }

    /*
     * Returns an HTML to style a table cell based on code for split cell.
     */
    getSplitCell(code) {
        if (this.lessonQueue[2].length === 2 && this.lessonCodes[code].includes("quarter-activity")) {
            this.lessonQueue[2].splice(0, 1);
        }

        return this.lessonCodes[code];
    }

    /*
     * Creates a array of lessons, divided to two arrays (1/2 hour and 3/4 hour).
     */
    generateLessonQueue() {
        // Reset lesson queue
        this.lessonQueue = [[], [], ["Hosing", "Assess"]];

        for (var key in this.props.lipData["lessons"]) {
            if (key !== "half" && key !== "threequater") {
                for (var numLessons = 0; numLessons < this.props.lipData["lessons"][key]; numLessons++) {
                    this.lessonQueue[(["Level 6", "Level 7", "Level 8", "Level 9", "Level 10", "Basics I", "Basics II", "Strokes"].indexOf(key) > -1) ? 1 : 0].push(key);
                }
            }
        }
    }

    /*
     * Sums the number of individual preferred lessons.
     */
    preferenceSizeDifference(newInstructor, element) {
        return
                this.props.lipData["instructorPreferences"][newInstructor].reduce(function(sum, next) {
                        return sum + next.length;
                    }, 0)
                <
                this.props.lipData["instructorPreferences"][element].reduce(function(sum, next) {
                        return sum + next.length;
                    }, 0)
        ;
    }

    /*
     *  Orders the instructors by the length of their related element in
     *  this.props.lipData["instructorPreferences"], in ascending order.
     *  Instructors with empty preference objects are appended to the array.
     */
    orderInstructorsByPreferencesSize() {
        var newInstructorOrder = [];

        // Append instructors with preferences' index in sorted order.
        for (var newInstructor = 0; newInstructor < Object.keys(this.props.lipData["instructorPreferences"]).length; newInstructor++) {
            // Find sorted index of new instructor.
            for (var index = 0; index < newInstructorOrder.length && !this.preferenceSizeDifference(Object.keys(this.props.lipData["instructorPreferences"])[newInstructor], newInstructorOrder[index]); index++);

            // Insert new instructor.
             newInstructorOrder.splice(index, 0, newInstructor + 1);
        }

        // Append instructors without preferences' index in random order.
         newInstructorOrder = newInstructorOrder.concat(
             (function(array) {
                 var m = array.length, i;

                 // While there remain elements to shuffle.
                 while (m) {
                     // Pick a remaining element.
                     i = Math.floor(Math.random() * m--);

                     // Swap with the current element.
                     array[m] = [array[i], array[i] = array[m]][0];
                 }

                 return array;
             }.bind(this))([...Array(this.props.lipData["instructors"].length + 1).keys()].filter(function(index) {
                 return newInstructorOrder.indexOf(index) === -1 && index > 0
             }.bind(this)))
         );
        return newInstructorOrder;
    }

    /*
     * Assigns lessons to slots based on the instructors' preferences
     */
    assignLessons(instructor, index, q) {
        if (typeof instructor[index] === "string") {
            instructor[index] = this.getSplitCell(instructor[index]);

            return q;
        }

        // Cell is an integer, no stand alone '3' cell; default is an empty cell.
        if (instructor[index] === 1 || instructor[index] === 2) {
            var newLesson;
            var assigned = false;

            // If instructor has preferences.
            if (Object.keys(this.props.lipData["instructorPreferences"]).indexOf(instructor[0]) !== -1) {
                for (var lesson = 0; !assigned && lesson < q[instructor[index] - 1].length; lesson++) {
                    if (this.props.lipData["instructorPreferences"][instructor[0]][instructor[index] - 1].indexOf(q[instructor[index] - 1][lesson]) !== -1) {
                        instructor[index] = q[instructor[index] - 1].splice(lesson, 1)[0];

                        assigned = true;
                    }
                }
            }

            // No preferred lesson is found.
            if (!assigned) {
                instructor[index] = q[instructor[index] - 1].splice(0, 1)[0];
            }
        } else if (instructor[index] === 4) {
            instructor[index] = "Private";
        } else {
            instructor[index] = "";
        }

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
                    this.assignLessons(newGrids[grid][instructorOrder[instructor - 1]], slot, queue);
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
                                (gridArrays[gridIndex][instructor][slot][0] === "<" && this.lessonQueue[1].indexOf(gridArrays[gridIndex][instructor][slot - 1]) > -1)
                                ||
                                (gridArrays[gridIndex][instructor][slot - 1][0] === "<" && this.lessonQueue[1].indexOf(gridArrays[gridIndex][instructor][slot]) > -1)
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

        // Click to make modal of list element
        $("#grid-table a").click(function() {
            $("#grid-modal").css({
                "display": "block"
            });
            $(".vertical-line-center").css({
                "height": "63px",
                "margin": "-31.5px 0 0 50px"
            });
            $(".vertical-line-left").css({
                "height": "63px",
                "margin": "-18px 0 0 40px"
            });
            $(".vertical-line-right").css({
                "height": "63px",
                "margin": "-45px 0 0 55px"
            });
            $("#modal-grid-container").append($($(this).children()[0]).clone());
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
