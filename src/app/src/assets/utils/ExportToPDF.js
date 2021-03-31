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

        this._pdfOutput = "dataurlnewwindow";
        this.quarterActivities = [
            "",
            "Work"
        ];
        this.threeQuarterLessons = [
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
    }

    /**
     * Sets the output type of the generated PDF.
     * @param {String} output           One of the jspdf output types.
     */
    setPDFOutput(output) {
        this._pdfOutput = output;
    }

    /**
     * Generates the PDF, in some format.
     * @param  {String} setTitle        The Set title associated with this Grid.
     * @return {[type]}                 The form of output of the PDF, dependent on _pdfOutput.
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

        dateCreated = [
            newDate.getFullYear(),
            newDate.getMonth() + 1,
            newDate.getDate()
        ].join("-");

        numColumns = tableCells.length / tableRows.length;

        tableRows.forEach((row, rowIndex) => {
            row.querySelectorAll("td").forEach((cell, cellIndex) => {
                if (this.threeQuarterLessons.includes(cell.textContent)) {
                    let index = (rowIndex * numColumns) + cellIndex;

                    if (cell.previousElementSibling) {
                        let pText = cell.previousElementSibling.textContent;

                        if (this.quarterActivities.includes(pText)) {
                            splitCellIndices.push(index - 1);
                        }
                    }

                    splitCellIndices.push(index);

                    if (cell.nextElementSibling) {
                        let nText = cell.nextElementSibling.textContent;

                        if (this.quarterActivities.includes(nText)) {
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
            "alternateRowStyles": {
                "fillColor": [255, 255, 255],
                "textColor": [45, 62, 80]
            },
            "startY": 60,
            "didDrawPage": (cellHookData) => {
                tableCoordinates = this._didDrawPage(cellHookData, setTitle);
            },
            "didParseCell": (cellHookData) => {
                let cellIndex = (cellHookData.row.index * numColumns) + cellHookData.column.index;

                cellHookData.cell = this._didParseCell(
                    cellHookData.cell,
                    prevCell,
                    splitCellIndices.includes(cellIndex)
                );

                prevCell = cellHookData.cell;
            },
            "didDrawCell": (cellHookData) => {
                let cellIndex = (cellHookData.row.index * numColumns) + cellHookData.column.index;

                lineCoordinates = this._didDrawCell(
                    cellHookData.cell,
                    prevCell,
                    lineCoordinates,
                    splitCellIndices.includes(cellIndex)
                );

                prevCell = cellHookData.cell;
            }
        });

        this._drawLines(doc, lineCoordinates, tableCoordinates);

        let filename = "grid-" + setTitle.replace(/\s/g, '') + "-" + dateCreated + ".egbtr.pdf";

        return doc.output(this._pdfOutput, {
            "filename": filename
        });
    }

    /**
     * Hook to draw additional content to the PDF.
     * @param  {Object} data            Metadata relating to the PDF page.
     * @param  {String} setTitle        The Set title associated with this Grid.
     * @return {Array}                  A box defining what space the PDF should occupy.
     */
    _didDrawPage(data, setTitle) {
        let keys = ['doc', 'settings', 'cursor'];
        let intersection = Object.keys(data).filter(k => keys.includes(k));

        if (intersection.length < 3 || !data.doc.text) return;

        data.doc.text("Grid - " + setTitle, 40, 30);

        return [
            data.settings.startY,
            data.settings.startY,
            data.cursor.x,
            data.cursor.y
        ];
    }

    /**
     * Hook to apply changes before the cell is drawn.
     * @param  {Object}  cell           Metadata about the current cell being parsed.
     * @param  {Object}  prevCell       Metadata about the previous cell parsed.
     * @param  {Boolean} isSplitCell    Indicator if the current cell is part of a split table cell.
     * @return {Object}                 The updated metadata of the current cell parsed.
     */
    _didParseCell(cell, prevCell, isSplitCell) {
        if (isSplitCell) {
            if (!((cell && cell.text) &&
                    cell.styles &&
                    cell.styles.lineColor &&
                    cell.styles.lineWidth)) return cell;

            if (prevCell && prevCell.text) {
                // halign is set to default to "center", which doesn't work for any of the quarterActivities.
                if (this.threeQuarterLessons.includes(prevCell.text[0]) && this.quarterActivities.includes(cell.text[0])) {
                    // Place Work on the right side of cell divider.
                    cell.styles.halign = "right";
                } else if (this.threeQuarterLessons.includes(cell.text[0]) && this.quarterActivities.includes(prevCell.text[0]) && prevCell.styles) {
                    // Place Work on the left side of cell divider.
                    prevCell.styles.halign = "left";
                }
            }

            cell.styles.lineWidth = 0.001;
            cell.styles.lineColor = cell.styles.fillColor;
        }

        if (cell.text[0] === "Private") {
            cell.styles.fillColor = [118, 118, 118];
            cell.styles.textColor = [255, 255, 255];
        }

        return cell;
    }

    /**
     * Hook to run after the cell has been drawn.
     * @param  {Object}  cell               Metadata about the current cell being drawn.
     * @param  {Object}  prevCell           Metadata about the previous cell drawn.
     * @param  {Array}   splitCellLines     Array of values on where to draw split cell lines.
     * @param  {Boolean} isSplitCell        Indicator if the current cell is part of a split table cell.
     * @return {Array}                      The updated array with values on where to draw split cell lines.
     */
    _didDrawCell(cell, prevCell, splitCellLines, isSplitCell) {
        let intersection, keys = ['x', 'y', 'width', 'height'];

        if (!(isSplitCell &&
                (cell && cell.text) &&
                (prevCell && prevCell.text) &&
                Array.isArray(splitCellLines))) {
            return splitCellLines;
        }

        if (this.threeQuarterLessons.includes(prevCell.text[0]) && this.quarterActivities.includes(cell.text[0])) {
            intersection = Object.keys(cell).filter(k => {
                let v = cell[k];
                cell[k] = Number(v);

                return keys.includes(k) && !isNaN(v);
            });

            if (intersection.length < 4) return splitCellLines;

            splitCellLines.push([
                cell.x + (cell.width / 2),
                cell.y,
                cell.x + (cell.width / 2),
                cell.y + cell.height
            ]);
        } else if (this.threeQuarterLessons.includes(cell.text[0]) && this.quarterActivities.includes(prevCell.text[0])) {
            intersection = Object.keys(prevCell).filter(k => {
                let v = prevCell[k];
                prevCell[k] = Number(v);

                return keys.includes(k) && !isNaN(v);
            });

            if (intersection.length < 4) return splitCellLines;

            splitCellLines.push([
                prevCell.x + (prevCell.width / 2),
                prevCell.y,
                prevCell.x + (prevCell.width / 2),
                prevCell.y + prevCell.height
            ]);
        }

        return splitCellLines;
    }

    /**
     * Draws the split cell lines.
     * @param  {Object} doc                 The PDF document.
     * @param  {Array}  lineCoordinates     The starting and ending co-ordinates of the split cell lines.
     * @param  {Array}  tableCoordinates    The positions of the top-left and bottom-right corners of the table.
     * @return {undefined}                  There is no value returned.
     */
    _drawLines(doc, lineCoordinates, tableCoordinates) {
        if (!(doc &&
                typeof doc.line === 'function')) return;
        if (!(Array.isArray(tableCoordinates) &&
                tableCoordinates.length === 4 &&
                !tableCoordinates.some(isNaN))) return;
        if (!(Array.isArray(lineCoordinates) &&
                lineCoordinates.every(Array.isArray))) return;

        let [tableX1, tableY1, tableX2, tableY2] = tableCoordinates;

        doc.setDrawColor(200);
        doc.setLineWidth(0.5);

        // Draw table border lines (to compensate for removing cell borders on edge of table). Skip left-most and top-most border because they aren't removed.
        doc.line(tableX2, tableY1, tableX2, tableY2); // Right border
        doc.line(tableX1, tableY2, tableX2, tableY2); // Bottom border

        // Draw split cell lines.
        for (let coords = 0; coords < lineCoordinates.length; coords++) {
            let line = lineCoordinates[coords];

            if (line.length !== 4 || line.some(isNaN)) continue;

            doc.line(...line);
        }
    }
}

export default ExportToPDF;
