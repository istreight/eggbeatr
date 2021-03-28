/**
 * FILENAME:    ExportToPDF.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the ExportToPDF class for
 *  exporting schedules of the lesson calendar
 *  web application.
 */

import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


class ExportToPDF extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
    * Export a Grid to a PDF document.
    */
    pdf(setTitle) {
        let dateCreated, prevCell, numColumns;

        let newDate = new Date();
        let lineCoordinates = [];
        let tableCoordinates = [];
        let splitCellIndices = [];
        let doc = new jsPDF("landscape", "pt");
        let tableXPath = "#dynamicGrid .modal .pure-menu-link table";
        let tableCells = document.querySelectorAll(tableXPath + " td");
        let tableRows = document.querySelectorAll(tableXPath + " tbody tr");
        let quarterActivities = [
            "",
            "Work"
        ];
        let threeQuarterLessons = [
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

        numColumns = tableCells.length / tableRows.length;

        tableRows.forEach((row, rowIndex) => {
            row.querySelectorAll("td").forEach((cell, cellIndex) => {
                if (threeQuarterLessons.includes(cell.textContent)) {
                    let index = (rowIndex * numColumns) + cellIndex;

                    if (cell.previousElementSibling) {
                        let pText = cell.previousElementSibling.textContent;

                        if (quarterActivities.includes(pText)) {
                            splitCellIndices.push(index - 1);
                        }
                    }

                    splitCellIndices.push(index);

                    if (cell.nextElementSibling) {
                        let nText = cell.nextElementSibling.textContent;

                        if (quarterActivities.includes(nText)) {
                            splitCellIndices.push(index + 1);
                        }
                    }
                }
            });
        });

        autoTable(doc, {
            "html": tableXPath,
            "bodyStyles": {
                "fillColor": [45, 62, 80],
                "textColor": [255, 255, 255]
            },
            "headStyles": {
                "fillColor": 224,
                "textColor": 0
            },
            "styles": {
                "fontSize": 24,
                "lineColor": 200,
                "lineWidth": 0.5,
                "halign": "center",
                "cellPadding": 16
            },
            "alternateRowStyles" : {
                "fillColor": [255, 255, 255],
                "textColor": [45, 62, 80]
            },
            "startY": 60,
            "didDrawPage": (cellHookData) => {
                tableCoordinates = this._didDrawPage(cellHookData, setTitle);
            },
            "didParseCell": (cellHookData) => {
                cellHookData.cell = this._didParseCell(
                    cellHookData,
                    prevCell,
                    numColumns,
                    splitCellIndices,
                    threeQuarterLessons,
                    quarterActivities
                );

                prevCell = cellHookData.cell;
            },
            "didDrawCell": (cellHookData) => {
                lineCoordinates = this._didDrawCell(
                    cellHookData.cell,
                    cellHookData,
                    prevCell,
                    numColumns,
                    lineCoordinates,
                    splitCellIndices,
                    quarterActivities,
                    threeQuarterLessons
                );

                prevCell = cellHookData.cell;
            }
        });

        doc.setDrawColor(200);
        doc.setLineWidth(0.5);

        this._drawLines(doc, lineCoordinates, tableCoordinates);

        return doc.output("dataurlnewwindow", {
            "filename":  "grid-" + setTitle.replace(/\s/g, '') + "-" + dateCreated + ".egbtr.pdf"
        });
    }

    /**
    * Opertions performed as page is created.
    */
    _didDrawPage(data, setTitle) {
        data.doc.text("Grid - " + setTitle, 40, 30);

        return [
            data.settings.startY,
            data.settings.startY,
            data.cursor.x,
            data.cursor.y
        ];
    }

    /**
    * Operations performed on the cell as it is created.
    */
    _didParseCell(data, prevCell, numColumns, splitCellIndices, threeQuarterLessons, quarterActivities) {
        let cell = data.cell;
        let cellIndex = (data.row.index * numColumns) + data.column.index;

        if (splitCellIndices.includes(cellIndex)) {
            if (prevCell) {
                // halign is set to default to "center", which doesn't work for any of the quarterActivities.
                if (threeQuarterLessons.includes(prevCell.text[0]) && quarterActivities.includes(cell.text[0])) {
                    // Place Work on the right side of cell divider.
                    cell.styles.halign = "right";
                } else if (threeQuarterLessons.includes(cell.text[0]) && quarterActivities.includes(prevCell.text[0])) {
                    // Place Work on the left side of cell divider.
                    prevCell.styles.halign = "left";
                }
            }

            cell.styles.lineColor = cell.styles.fillColor;
            cell.styles.lineWidth = 0.001;
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
    _didDrawCell(cell, data, prevCell, numColumns, lineCoordinates, splitCellIndices, quarterActivities, threeQuarterLessons) {
        let cellIndex = (data.row.index * numColumns) + data.column.index;

        if (splitCellIndices.includes(cellIndex) && prevCell) {
            if (threeQuarterLessons.includes(prevCell.text[0]) && quarterActivities.includes(cell.text[0])) {
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
    _drawLines(doc, lineCoordinates, tableCoordinates) {
        let [tableX1, tableY1, tableX2, tableY2] = tableCoordinates;

        // Draw table border lines (to compensate for removing cell borders on edge of table). Skip left-most and top-most border because they aren't removed.
        doc.line(tableX2, tableY1, tableX2, tableY2); // Right border
        doc.line(tableX1, tableY2, tableX2, tableY2); // Bottom border

        // Draw split cell lines.
        for (let line = 0; line < lineCoordinates.length; line++) {
            let [x1, y1, x2, y2] = lineCoordinates[line];

            doc.line(x1, y1, x2, y2);
        }
    }
}

export default ExportToPDF;
