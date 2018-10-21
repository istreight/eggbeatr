/**
 * FILENAME:    ExportToPDF.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the ExportToPDF class for
 *  exporting schedules of the lesson calendar
 *  web application.
 */

import $ from 'jquery';
import React from 'react';
import jsPDF from 'jspdf';
import PropTypes from 'prop-types';
import autoTable from 'jspdf-autotable';

class ExportToPDF extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Export a Grid to a PDF document.
     */
    pdf(setTitle, lessonTimes) {
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
            "Work"
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
            { "dataKey": "id", "title": "Instructor" },
            { "dataKey": "start", "title": lessonTimes[0] },
            { "dataKey": "startPlusHalf", "title": lessonTimes[1] },
            { "dataKey": "startPlusOne", "title": lessonTimes[2]  },
            { "dataKey": "startPlusOneAndHalf", "title": lessonTimes[3] },
            { "dataKey": "startPlusTwo", "title": lessonTimes[4] }
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
            "bodyStyles": {
                "fillColor": [45, 62, 80],
                "textColor": [255, 255, 255]
            },
            "headerStyles": {
                "fillColor": 224,
                "textColor": 0
            },
            "styles": {
                "fontSize": 24,
                "lineColor": 200,
                "lineWidth": 0.5
            },
            "startY": 60,
            "addPageContent": (data) => {
                tableCoordinates = this.addPageContent(doc, data, setTitle);
            },
            "createdCell": (cell, data) => {
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
            "drawCell": (cell, data) => {
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
     addPageContent(doc, data, setTitle) {
         doc.text("Grid - " + setTitle, 40, 30);

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
                 // Place Work on the right side of cell divider.
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
}

ExportToPDF.propTypes = {
    callback: PropTypes.func.isRequired,
    connector: PropTypes.object.isRequired,
    createComponent: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    removeComponent: PropTypes.func.isRequired,
    renderComponent: PropTypes.func.isRequired
}

export default ExportToPDF;
