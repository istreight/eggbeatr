/**
 * FILENAME:    Grid.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the Grid class for the schedule
 *  content of the lesson calendar web application.
 * The Grid class is exported.
 *
 * The content is displayed here as a table, but
 *  the values will be generated in another component.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import jsPDF from 'jspdf';
import Table from 'utils/Table';
import Input from 'utils/Input';
import Modal from 'utils/Modal';
import Anchor from 'utils/Anchor';
import autoTable from 'jspdf-autotable';
import Tutorial from 'specializations/Tutorial';
import ExportToPDF from 'functions/ExportToPDF';
import UnorderedList from 'utils/UnorderedList';
import WaitIndicator from 'specializations/WaitIndicator';
import DurationButton from 'specializations/DurationButton';
import SectionDescription from 'specializations/SectionDescription';


class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.grid = {};
        this.duration = 1.5;
        this.controllerData = {};
        this.lessonQueue = [[], [], ["Hose", "Swim"]];
        this.lessonCodes = {
            "02": "<div class='line line-left'></div>",
            "04": "<div class='line line-left'></div><div class='private-right'></div>",
            "20": "<div class='line line-right'></div>",
            "22": "<div class='line line-right'></div>",
            "23": "<div class='line line-right'><p>" + this.lessonQueue[2][0] + "</p></div>",
            "24": "<div class='line line-left'></div><div class='private-right'></div>",
            "32": "<div class='line line-left'><p>" + this.lessonQueue[2][0] + "</p></div>",
            "40": "<div class='line line-right'></div><div class='private-left'></div>",
            "42": "<div class='line line-right'></div><div class='private-left'></div>"
        };
    }

    componentDidMount() {
        this.grid = this.props.initData;
        this.controllerData = this.props.callback(this.grid, "grid", false);

        var lessonTimes = this.grid.lessonTimes;
        if (!(lessonTimes && lessonTimes[0])) {
            $("#dynamicGrid input").attr("placeholder", "");
        } else {
            $("#dynamicGrid input").attr("placeholder", lessonTimes[0]);
        }

        $("#dynamicGrid .content-section-description a").click(this.generateGrid.bind(this));

        $("#dynamicGrid input").blur(this.setLessonTimes.bind(this));

        $("#dynamicGrid .duration-button").eq(0).addClass("pure-menu-selected");
        $("#dynamicGrid .duration-button").click(this.updateDuration.bind(this));

        $(window).click(this.hideModal);
    }

    /**
     * Update the object duration value and display the
     *  correct button as selected.
     */
    updateDuration() {
        var duration;
        var durationIndex;
        var durationContainer = $("#dynamicGrid .pure-menu-horizontal:not(.pure-menu-scrollable)");

        // Set the lesson times based on duration.
        this.setLessonTimes();

        // Find previously selected duration and remove "selected" class.
        $(event.target).closest("ul").find(".pure-menu-selected").removeClass("pure-menu-selected");

        $(event.target).addClass("pure-menu-selected");

        durationIndex = durationContainer.find("li a").index(event.target);
        this.duration = (durationIndex / 2.0) + 1;

        // If a grid exists, generate a new one with the new duration.
        if ($("#dynamicGrid .pure-menu-scrollable ul li").length > 0) {
            this.generateGrid();
        }
    }

    /**
     * Validate the 'Start Time' input.
     */
    validateStartTime(startTime) {
        var target = $("#dynamicGrid input");
        var reHour = new RegExp(/^([1-9]|1[0-2])$/);
        var reMinute = new RegExp(/^([0-5][05]|60)$/);

        var [hour, minute] = startTime.split(":");

        var isValid = reHour.test(hour) && reMinute.test(minute);

        if (isValid) {
            $(target).attr("placeholder", startTime);
            $(target).parent().removeClass("error-cell");
        } else {
            $(target).parent().addClass("error-cell");
        }

        return isValid;
    }

    /**
     * Sets all 5 possible lesson start times.
     */
    setLessonTimes() {
        var startTime;

        $("#dynamicGrid input").attr("placeholder", "");

        if (event && $(event.target).is("input")) {
            startTime = $(event.target).val();
        } else {
            if (!this.grid.lessonTimes) {
                return;
            }

            startTime = this.grid.lessonTimes[0];
        }

        if (!this.validateStartTime(startTime)) {
            return;
        }

        var [hour, minute] = startTime.split(":");

        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);

        // Maximum amount of slots is 5.
        this.grid.lessonTimes = [startTime];
        for (var slot = 0; slot < 4; slot++) {
            var newTime;

            minute = (minute + 30) % 60;

            if (minute < 30) {
                hour = hour % 12 + 1;
            }

            if (minute < 10) {
                minute = "0" + minute;
            }

            newTime = [hour, minute].join(":");

            this.grid.lessonTimes.push(newTime);
        }

        $("#dynamicGrid input").val("");
        $("#dynamicGrid input").attr("placeholder", this.grid.lessonTimes[0]);

        if (!this.grid.id) {
            var body = this.grid;

            this.props.createComponent(body, "Grid")
                .then((res) => {
                    this.grid = res;
                });
        } else {
            this.props.callback(this.grid, "grid", true);
        }
    }

    /**
     * Display a notification if no Grids are created with
     *  the number of instructors to be added to create a
     *  Grid, given duration and lesson quantities are constant.
     */
    noGridsNotification(duration, numInstructors, numHalfLessons, numThreeQuarterLessons) {
        var noGridsString = "No Grids were created<br />Add 0 Instructor";

        var instructorTime = duration * numInstructors;
        var lessonTime = 0.5 * numHalfLessons + 0.75 * numThreeQuarterLessons;

        var numAddInstructors = Math.ceil((lessonTime - instructorTime) / duration);

        if (isNaN(numAddInstructors)) {
            this.handleGridError();
            return;
        }

        var notification = noGridsString.replace(/[0-9]/, numAddInstructors);

        if (numAddInstructors !== 1) {
            notification = notification + "s";
        }

        $("#dynamicGrid p").empty().hide();
        $("#dynamicGrid p").fadeIn(800);
        $("#dynamicGrid p").append(notification);

        $("#dynamicGrid .create-indicator").css("visibility", "hidden");
    }

    /**
     * Returns an HTML to style a table cell based on
     *  code for split cell.
     */
    getSplitCell(code) {
        return this.lessonCodes[code];
    }

    /**
     * Creates an array of lessons, divided to two arrays:
     *  1/2 hour & 3/4 hour.
     */
    generateLessonQueue() {
        var lessonQueue = [[], [], ["Hose", "Swim"]];

        var threeQuarterLessons = [
            "Level 6",
            "Level 7",
            "Level 8",
            "Level 9",
            "Level 10",
            "Basics I",
            "Basics II",
            "Strokes",
            "Schoolboard"
        ];

        for (var key in this.controllerData.lessons) {
            if (key === "half" || key === "threequarter") {
                continue;
            }

            var value = this.controllerData.lessons[key];
            var keyArray = Array(value.quantity).fill(key);

            if (threeQuarterLessons.includes(key)) {
                lessonQueue[1] = lessonQueue[1].concat(keyArray);
            } else {
                lessonQueue[0] = lessonQueue[0].concat(keyArray);
            }
        }

        this.lessonQueue = lessonQueue;
    }

    /**
     * Sums the number of preferred lessons.
     */
    getPreferenceLength(newInstructor) {
        var instructor = this.controllerData.instructorPreferences[newInstructor];

        return instructor.lessons.length;
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
     *  preferences, in ascending order.
     * Instructors with empty preference objects are
     *  appended randomly to the array.
     */
    orderInstructorsByPreferencesSize() {
        var newInstructorOrder = [];
        var instructorPreferenceLengths = [];

        for (var instructorName in this.controllerData.instructorPreferences) {
            var preferenceSize = this.getPreferenceLength(instructorName);

            instructorPreferenceLengths.push({
                "instructorName": instructorName,
                "preferenceSize": preferenceSize
            });
        }

        instructorPreferenceLengths.sort((current, previous) => {
            return current.preferenceSize - previous.preferenceSize;
        }).forEach((instructorPreference) => {
            newInstructorOrder.push(instructorPreference.instructorName);
        });

        var noPreferenceInstructors = this.controllerData.instructorsArray.filter((instructor) => {
            return !newInstructorOrder.includes(instructor);
        });

        var randomOrderInstructors = this.randomizeArray(noPreferenceInstructors);

        // Append instructors without preferences' index in random order.
        return newInstructorOrder.concat(randomOrderInstructors);;
    }

    /**
     * Return a list on the names of the private-only instructors.
     */
    getPrivateOnlyInstructors() {
        return this.controllerData.instructorsArray.filter((value, index) => {
            var instructor = this.controllerData.instructors[value];
            return instructor.privateOnly;
        });
    }

    /**
     * Return a list of the names of instructors that teach group lessons.
     */
    getGroupInstructors(instructors) {
        return instructors.filter((value) => {
            return !this.getPrivateOnlyInstructors().includes(value);
        });
    }

    /**
     * Assigns lessons to slots based on the instructors' preferences
     */
    assignLessons(instructor, index, q) {
        var lessonCode = instructor[index];
        var prefs = this.controllerData.instructorPreferences;

        // If the slot locarion is a code (string), it isn't a lesson.
        if (typeof lessonCode === "string") {
            instructor[index] = this.getSplitCell(lessonCode);

            return q;
        }

        // There are no stand alone '3' cells.
        if (lessonCode === 1 || lessonCode === 2) {
            var assigned = false;
            var instructorName = instructor[0];
            var typedLessons = q[lessonCode - 1];

            if (instructorName in prefs) {
                var prefLessonsByCode = [];
                var lessonPrefs = prefs[instructorName].lessons;

                for (var lessonIndex = 0; lessonIndex < lessonPrefs.length; lessonIndex++) {
                    if (typedLessons.includes(lessonPrefs[lessonIndex])) {
                        prefLessonsByCode.push(lessonPrefs[lessonIndex])
                    }
                }

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
            lessonCode = "";
        }

        instructor[index] = lessonCode;
        q[lessonCode - 1] = typedLessons;

        return q;
    }

    /**
     * Gets an array generated by the GridFactory, server-side.
     */
    generateGridArrays() {
        return this.props.connector.getGridArrays(
            Object.assign(this.controllerData, {
                "duration": this.duration,
                "lessonTimes": this.grid.lessonTimes,
                "privateOnlyInstructors": this.getPrivateOnlyInstructors()
            })
        )
            .then(newGrids => this.modifyGridArrays(newGrids))
            .catch(error => console.error(error));
    }

    /**
     * Modifies the array to map to Red Cross levels.
     */
    modifyGridArrays(newGrids) {
        var instructorOrder = this.orderInstructorsByPreferencesSize();
        var privateOnlyInstructors = this.getPrivateOnlyInstructors();

        instructorOrder = this.getGroupInstructors(instructorOrder);

        // Set allocated lessons slots to swim & private lessons.
        for (var grid = 0; grid < newGrids.length; grid++) {
            var queue = jQuery.extend(true, [], this.lessonQueue);

            for (var slot = 1; slot < newGrids[grid][1].length; slot++) {
                for (var instructor = 1; instructor < newGrids[grid].length; instructor++) {
                    for (var instructorRow = 1; instructorRow < newGrids[grid].length; instructorRow++) {
                        if (newGrids[grid][instructorRow][0] === instructorOrder[instructor - 1]) {
                            this.assignLessons(newGrids[grid][instructorRow], slot, queue);
                            break;
                        }
                    }
                }
            }
        }

        return newGrids;
    }

    handleGridError() {
        var createLabel = $("#dynamicGrid .create-label");
        var gridErrorMessasge = "ERROR<br /><p>An error occured creating grids.<br />Please contact administrator.</p>";

        $("#dynamicGrid .create-spinner").hide();

        createLabel.html(gridErrorMessasge);
        createLabel.addClass("create-error");
    }

    generateGrid() {
        var createIndicatorMessage = "creating...";
        var createLabel = $("#dynamicGrid .create-label");

        // Empty list of Grids.
        $("#dynamicGrid .pure-menu-scrollable ul").empty();

        // Show loading indicator.
        createLabel.removeClass("create-error");
        createLabel.html(createIndicatorMessage);
        $("#dynamicGrid .create-spinner").show();
        $("#dynamicGrid .create-indicator").css("visibility", "visible");

        // Create the queue of lessons.
        this.generateLessonQueue();

        // Update controllerData with components' data.
        this.controllerData = this.props.callback(this.grid, "grid", false);

        // Get base array to represent grid.
        this.generateGridArrays()
            .then(gridArrays => this.displayGrid(gridArrays))
            .catch((error) => {
                console.error(error);

                this.handleGridError();
            });
    }

    /**
     * Transforms an array to a PureCSS table.
     * The first row of the array is considered as the Header of the table.
     */
    displayGrid(gridArrays) {
        var newTables = "";

        if (gridArrays.length === 0) {
            var privateOnlyInstructors = this.getPrivateOnlyInstructors();
            var instructors = Object.keys(this.controllerData.instructors);

            instructors = this.getGroupInstructors(instructors);

            this.noGridsNotification(
                this.duration,
                instructors.length,
                this.controllerData.lessons.half,
                this.controllerData.lessons.threequarter
            );

            return;
        } else {
            $("#dynamicGrid p").hide();
        }

        // Hide tutorial message, error notification, & current grids.
        $("#dynamicGrid .content-section-footer").css({
            "display": "none"
        });

        // Transform array to HTML table with PureCSS styling
        for (var gridIndex = 0; gridIndex < gridArrays.length; gridIndex++) {
            var newTable = "<li class='pure-menu-item'><a class='pure-menu-link'><table class='pure-table'><thead>";

            for (var instructor = 0; instructor < gridArrays[gridIndex].length; instructor++) {
                if (instructor === 0) {
                    newTable += "<tr>";
                } else {
                    newTable += "<tr" + ((instructor % 2 === 0) ? " class='table-even'" : " class='table-odd'") + ">";
                }

                for (var slot = 0; slot < 2 * this.duration + 1; slot++) {
                    // Add the header, stored in the first row of the array.
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
                            /**
                             * If it's a divisor cell and the previous is a
                             *  3/4 hour lesson; or,
                             *  if it's a 3/4 hour lesson and the previous
                             *  is a divisor cell.
                            */
                            if (gridArrays[gridIndex][instructor][slot].includes("private-right")) {
                                // If the it is a right-private divisor cell next to a threequarter lesson cell.
                                var cellContents = gridArrays[gridIndex][instructor][slot];

                                if (gridArrays[gridIndex][instructor][slot + 1].includes("private-left")) {
                                    cellContents = cellContents.replace("right'></", "right'>Pri</");
                                }

                                newTable += "<td class='no-border private-right'>" + cellContents + "</td>";
                            } else {
                                newTable += "<td class='no-border is-left'>" + gridArrays[gridIndex][instructor][slot] + "</td>";
                            }
                        } else if (gridArrays[gridIndex][instructor][slot].includes("private-left")) {
                            // It is to the right of a private lesson.
                            var cellContents = gridArrays[gridIndex][instructor][slot];

                            if (gridArrays[gridIndex][instructor][slot - 1].includes("private-right")) {
                                cellContents = cellContents.replace("left'></", "left'>vate</");
                            }

                            newTable += "<td class='no-border private-left'>" + cellContents + "</td>";
                        } else if (gridArrays[gridIndex][instructor][slot].includes("private-right")) {
                            // It is to the left of a private lesson.
                            var cellContents = gridArrays[gridIndex][instructor][slot];

                            if (gridArrays[gridIndex][instructor][slot + 1].includes("private-left")) {
                                cellContents = cellContents.replace("right'></", "right'>Pri</");
                            }

                            newTable += "<td class='private-right'>" + cellContents + "</td>";
                        } else if (gridArrays[gridIndex][instructor][slot] === "Private") {
                            // It is a private lesson.
                            newTable += "<td class='private-lesson-cell" + ((gridArrays[gridIndex][instructor][slot - 1].includes("private-right")) ? " no-border is-left" : "") + "'>Private</td>";
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

            newTables += newTable + "</tbody></table></a></li>";
        }

        // Fit viewing window to the Grids' size.
        $("#dynamicGrid .pure-menu-scrollable").css({
            "width": (122.5 * (2 * this.duration + 1.5)) + "px"
        });

        // Eliminate space conflict with the GridChecklist.
        if (this.controllerData.instructors.length > 3) {
             $("#dynamicGrid").css({
                 "height": ($("#dynamicGrid").innerHeight() + (40 * (this.controllerData.instructors.length - 3))) + "px"
             });
        }

        // Hide loading indicator.
        $("#dynamicGrid .create-indicator").css("visibility", "hidden");

        $("#dynamicGrid .pure-menu-scrollable ul").append(newTables);

        // Click to make modal of list element.
        $("#dynamicGrid .pure-menu-scrollable a").click(this.showModal.bind(this));
    }

    /**
     * Update the content in the Grid modal.
     */
    addModalContent(tableListElement) {
        var prev;
        var next;
        var index;
        var header;
        var modalTable;
        var reHashNumber;

        var modalHeader = $("#dynamicGrid .modal-header");
        var prevButton = $("#dynamicGrid .modal-footer a.float-left");
        var nextButton = $("#dynamicGrid .modal-footer a.float-right");

        // Update modal header with Grid number.
        header = modalHeader.html();
        index = tableListElement.index() + 1;
        reHashNumber = new RegExp(/#[0-9]+/);
        header = header.replace(reHashNumber, "#" + index);
        modalHeader.html(header);

        // Rebind 'previous' button.
        prev = tableListElement.prev();
        if (prev.length > 0) {
            prevButton.removeClass("pure-button-disabled");
            prevButton.click(() => {
                this.addModalContent(prev);
            });
        } else {
            prevButton.addClass("pure-button-disabled");
            prevButton.unbind("click");
        }

        // Rebind 'next' button.
        next = tableListElement.next();
        if (next.length > 0) {
            nextButton.removeClass("pure-button-disabled");
            nextButton.click(() => {
                this.addModalContent(next);
            });
        } else {
            nextButton.addClass("pure-button-disabled");
            nextButton.unbind("click");
        }

        $("#dynamicGrid .modal-header a").click(this.exportToPDF.bind(this));

        modalTable = $(tableListElement).children("a").clone();
        $("#dynamicGrid .modal-body").html(modalTable);
    }

    /**
     * Add and show the modal contents.
     */
    showModal() {
        var tableListElement = $(event.target).closest("li");

        this.addModalContent(tableListElement);

        $("#dynamicGrid .modal").css({
            "display": "block"
        });
    }

    /**
     * Remove and hide the modal contents.
     */
    hideModal() {
        if (event.target === $("#dynamicGrid .modal")[0]) {
            $("#dynamicGrid .modal").css({
                "display": "none"
            });

            $("#dynamicGrid .modal-body").empty();
        }
    }

    /**
     * Export a Grid to a PDF document.
     */
    exportToPDF() {
        var columns;
        var prevCell;
        var numColumns;
        var dateCreated;
        var tableCoordinates;

        var rows = [];
        var isRowOdd = false;
        var instructors = [];
        var tableBorders = [];
        var lineCoordinates = [];
        var newDate = new Date();
        var splitCellIndices = [];
        var doc = new jsPDF("l", "pt");
        var tableCells = $("#dynamicGrid .modal td");
        var tableRows = $("#dynamicGrid .modal tbody tr");
        var quarterActivities = [
            "",
            "Hose",
            "Swim"
        ];
        var threeQuarterLessons = [
            "Level 6",
            "Level 7",
            "Level 8",
            "Level 9",
            "Level 10",
            "Basics I",
            "Basics II",
            "Strokes",
            "Schoolboard"
        ];

        dateCreated = [
            newDate.getFullYear(),
            newDate.getMonth() + 1,
            newDate.getDate()
        ].join("-");

        columns = [
            { dataKey: "id", title: "Instructor" },
            { dataKey: "start", title: this.grid.lessonTimes[0] },
            { dataKey: "startPlusHalf", title: this.grid.lessonTimes[1] },
            { dataKey: "startPlusOne", title: this.grid.lessonTimes[2]  },
            { dataKey: "startPlusOneAndHalf", title: this.grid.lessonTimes[3] },
            { dataKey: "startPlusTwo", title: this.grid.lessonTimes[4] }
        ];

        numColumns = tableCells.length / tableRows.length;
        columns = columns.slice(0, numColumns);

        tableRows.each((rowIndex, element) => {
            var rowsKey;
            var newCell = {};

            $(element).find("td").each((cellIndex, element) => {
                var cellText = $(element).text();
                var reName = new RegExp(/[A-Za-z\s]+/);

                if (cellIndex === 0 && reName.test(cellText)) {
                    instructors.push(cellText);
                }

                rowsKey = columns[cellIndex].dataKey;

                if (threeQuarterLessons.includes(cellText)) {
                    var index = (rowIndex * numColumns) + cellIndex;

                    if ($(element).prev().children().length > 0) {
                        splitCellIndices.push(index - 1);
                    }

                    splitCellIndices.push(index);

                    if ($(element).next().children().length > 0) {
                        splitCellIndices.push(index + 1);
                    }
                }

                newCell[rowsKey] = cellText;
            });

            rows.push(newCell);
        });

        // jsPDF Auto-Table: github.com/simonbengtsson/jsPDF-AutoTable
        doc.autoTable(columns, rows, {
            bodyStyles: {
                fillColor: [45, 62, 80],
                textColor: [255, 255, 255]
            },
            headerStyles: {
                fillColor: 224,
                textColor: 0
            },
            styles: {
                fontSize: 24,
                lineColor: 200,
                lineWidth: 0.5
            },
            startY: 60,
            addPageContent: (data) => {
                tableCoordinates = this.addPageContent(doc, data, dateCreated);
            },
            createdCell: (cell, data) => {
                if (instructors.includes(cell.text[0])) {
                    isRowOdd = !isRowOdd;
                }

                cell = this.createdCell(cell,
                    data,
                    isRowOdd,
                    numColumns,
                    splitCellIndices
                );
            },
            drawCell: (cell, data) => {
                lineCoordinates = this.drawCell(
                    cell,
                    data,
                    prevCell,
                    numColumns,
                    lineCoordinates,
                    splitCellIndices,
                    quarterActivities,
                    threeQuarterLessons
                );

                prevCell = cell;
            }
        });

        doc.setDrawColor(200);
        doc.setLineWidth(0.5);

        this.drawLines(doc, lineCoordinates, tableCoordinates);

        doc.save("grid-" + dateCreated + ".egbtr.pdf");
    }

    /**
     * Opertions performed as page is created.
     */
     addPageContent(doc, data, dateCreated) {
         doc.text("Grid - " + dateCreated, 40, 30);

         return [
             data.table.pageStartX,
             data.table.pageStartY,
             data.table.width  + data.table.pageStartX,
             data.table.height + data.table.pageStartY
         ];
     }

    /**
     * Operations performed on the cell as it is created.
     */
     createdCell(cell, data, isRowOdd, numColumns, splitCellIndices) {
         var cellIndex = (data.row.index * numColumns) + data.column.index;

         if (splitCellIndices.includes(cellIndex)) {
             cell.styles.lineColor = cell.styles.fillColor;
             cell.styles.lineWidth = 0.001;
         }

         if (isRowOdd) {
             cell.styles.fillColor = [255, 255, 255];
             cell.styles.textColor = [45, 62, 80];
         }

         if (cell.text[0] === "Private") {
             cell.styles.fillColor = [118, 118, 118];
             cell.styles.textColor = [255, 255, 255];
         }

         return cell;
     }

    /**
     * Draws the individual table cells in the PDF document.
     */
     drawCell(cell, data, prevCell, numColumns, lineCoordinates, splitCellIndices, quarterActivities, threeQuarterLessons) {
         var cellIndex = (data.row.index * numColumns) + data.column.index;

         if (splitCellIndices.includes(cellIndex) && prevCell) {
             if (threeQuarterLessons.includes(prevCell.text[0]) && quarterActivities.includes(cell.text[0])) {
                 // Place Hose/Swim on the right side of cell divider.
                 cell.textPos.x += cell.width / 2;

                 lineCoordinates.push([
                     cell.x + (cell.width / 2),
                     cell.y,
                     cell.x + (cell.width / 2),
                     cell.y + cell.height
                 ]);
             } else if (threeQuarterLessons.includes(cell.text[0]) && quarterActivities.includes(prevCell.text[0])) {
                 lineCoordinates.push([
                     prevCell.x + (prevCell.width / 2),
                     prevCell.y,
                     prevCell.x + (prevCell.width / 2),
                     prevCell.y + prevCell.height
                 ]);
             }
         }

         return lineCoordinates;
     }

    /**
     * Draws cell splitting lines and table borders in PDF document.
     */
    drawLines(doc, lineCoordinates, tableCoordinates) {
        var [tableX1, tableY1, tableX2, tableY2] = tableCoordinates;

        // Draw table border lines (to compensate for removing cell borders on edge of table).
        doc.line(tableX1, tableY1, tableX1, tableY2);
        doc.line(tableX2, tableY1, tableX2, tableY2);
        doc.line(tableX1, tableY1, tableX2, tableY1);
        doc.line(tableX1, tableY2, tableX2, tableY2);

        // Draw split cell lines.
        for (var line = 0; line < lineCoordinates.length; line++) {
            var [x1, y1, x2, y2] = lineCoordinates[line];

            doc.line(x1, y1, x2, y2);
        }
    }

    render() {
        return (
            <div>
                <h2 className="content-head is-right">
                    The Grid
                </h2>
                <div className="content-section-description is-right float-right">
                    Generate a lesson calendar.
                    <ul className="content-section-explanation">
                        <li>Select the duration</li>
                        <li>Cycle through the possible grids</li>
                        <li>Inspect each grid</li>
                    </ul>
                    <a className="pure-button right-button">
                        Create Grid
                    </a>
                    <p className="right-button"></p>
                </div>
                <div className="pure-menu-heading">
                    Start Time:
                    <input type="text"></input>
                </div>
                <div className="pure-menu pure-menu-horizontal">
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item">
                            <a className="pure-menu-heading">
                                Duration
                            </a>
                        </li>
                        <li className="pure-menu-item">
                            <a className="duration-button pure-menu-link">
                                1&frac12; hours
                            </a>
                        </li>
                        <li className="pure-menu-item">
                            <a className="duration-button pure-menu-link">
                                2 hours
                            </a>
                        </li>
                        <li className="pure-menu-item">
                            <a className="duration-button pure-menu-link">
                                2&frac12; hours
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="create-indicator">
                    <div className="create-spinner">
                        <span></span><span></span><span></span>
                    </div>
                    <div className="create-label">Creating...</div>
                </div>
                <div className="pure-menu pure-menu-horizontal pure-menu-scrollable">
                    <ul className="pure-menu-list"></ul>
                </div>
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            The Grid #0
                            <a className="pure-button">Export to PDF</a>
                        </div>
                        <div className="modal-body"></div>
                        <div className="modal-footer">
                            <a className="pure-button float-left">Previous</a>
                            <a className="pure-button float-right">Next</a>
                        </div>
                    </div>
                </div>
                <div className="content-section-footer">
                    <h2 className="content-head">
                        Step #4:
                    </h2>
                    <p>
                        Create a grid, and I&#039;ll  get cooking.
                    </p>
                </div>
            </div>
        );
    }
}

Grid.propTypes =  {
    callback: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    connector: PropTypes.object.isRequired
}

export default Grid;
