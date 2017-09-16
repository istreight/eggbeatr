/**
 * FILENAME:    GridFactory.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 26th, 2016
 *
 * This file contains the GridFactory class that generates an array of the grid
 * for the lesson calendar web application. This class requires input props.
 * The result array from the generateGrid() function is exported.
 *
 *
 * CHANGE LOG:
 *  26/10/16:
 *              Exports sample array for testing.
 *
 *  16/11/16:
 *              Migrated code from Lesson_Calendar/Prototyping/Scheduler.java.
 *              Translated Java to JavaScript, altered display functions, &
 *              removed statistics, error checks, & type transformation methods.
 *              Exports dynamic array based on input; sample array commented out.
 *
 *  18/11/16:
 *              Added private lessons to grid creation. Private lessons can be
 *              added dynamically from the Private section and will reserve
 *              time slots if set to "Weekly" ("Yes").
 *
 *  21/11/16:
 *              Added condensation of generated grid, mapped to 30-minute slots.
 *
 *  22/11/16:
 *              Modifed to account for "private" section of props.lipData passing
 *              array for each instructor.
 *
 *  03/12/16:
 *              Removed 3/4 hour lessons starting at the first 1/4 slot.
 */

import React, {Component, PropTypes} from 'react';

class GridFactory extends React.Component {
    constructor(props) {
        super(props);
        this.hasBothTypes;
        this.startTime = 9;
        this.endTime;
        this.gridList = [];
    }

    /**
     * LESSON CODES
     *  Empty:              0
     *  1/2 hour lesson:    1   (PAIRS)
     *  3/4 hour lesson:    2   (TRIPLETS)
     *  1/4 hour activity:  3   (SINGLE)
     *  Private lesson:     4
     */

    generateGrid(data) {
        console.log(data);

        /**
         * Generate dynamic array.
         * Add names of instructors and time slots.
         * parameter: [
         *  number of 1/2 hour lessons,
         *  number of 3/4 hour lessons,
         *  private lessons,
         *  number of instructors,
         *  length of lesson set,
         *  minimum number of hours per instructor.
         * ]
         */
        return this.fillGridList({
            numHalfLessons: data["lessons"]["half"],
            numThreeQuarterLessons: data["lessons"]["threequater"],
            privates: data["private"],
            instructors: data["instructors"],
            duration: data["duration"],
            minHoursPerInstructor: 0
        });
    }

    fillGridList(props) {
        console.log(props);

        // Combination 1/2 && 3/4 hour lessons.
        this.hasBothTypes = props.numHalfLessons > 0 && props.numThreeQuarterLessons > 0;

        var grid = Array(props.instructors.length).fill(Array(4 * props.duration).fill(0));
        for (var instructor = 0; instructor < props.instructors.length; instructor++) {
            grid[instructor] = [props.instructors[instructor]].concat(grid[instructor]);
        }

        // Set private lessons slots.
        for (var privateInstructor in props.privates) {
            if (props.instructors.indexOf(privateInstructor) > -1) {
                for (var privateTimeSlot in props.privates[privateInstructor]) {
                    if (props.privates[privateInstructor][privateTimeSlot][1] === "Yes") {
                        // Find instructor row.
                        var instructor;
                        grid.some(function(row, index) {
                            if (row[0] === privateInstructor) {
                                instructor = index;
                                return true;
                            }

                            return false;
                        });

                        var colon = privateTimeSlot.indexOf(":");

                        /**
                         * Find proper time slot.
                         *
                         * Offset from instructor name +
                         * Hour-value starting location +
                         * Minute-value starting location.
                         */
                        var slot = 1
                            + 4 * Math.floor(parseInt(privateTimeSlot.slice(0, colon)) - this.startTime)
                            + Math.floor(parseInt(privateTimeSlot.slice(colon + 1)) / 15);

                        // Number of slots private lesson will occupy.
                        var duration = Math.floor(parseInt(props.privates[privateInstructor][privateTimeSlot][0]) / 15);

                        // Allocate slot for private.
                        if (slot + duration < grid[0].length + 1)
                            grid[instructor].fill(4, slot, slot + duration);
                    }
                }
            }
        }

        this.generateGridArray(grid, 0, 0, props.numHalfLessons, props.numThreeQuarterLessons, props.minHoursPerInstructor);

        console.log("Number of Grids:", this.gridList.length);

        return this.gridList;
    }

    generateGridArray(grid, nextSlotStart, nextInstructorStart, numHalfHourLessons, numThreeQuaterHourLessons, minHoursPerInstructor) {
        if (grid.length === 0 || grid[0].length === 0) {
            return;
        }

        if (numHalfHourLessons < 1 && numThreeQuaterHourLessons < 1) {
            if (this.verifyMinHoursPerInstructor(grid, minHoursPerInstructor) && this.addHosing(grid)) {
                this.gridList.push(
                    this.condenseGrid(
                        [["Instructor", "9:00", "9:30", "10:00", "10:30", "11:00"]].concat(jQuery.extend(true, [], grid))
                    )
                );
            }

            this.removeHosing(grid);

            return;
        }

        for (var slot = nextSlotStart, increment = 0; slot < grid[0].length - 1; slot += 1 + increment) {
            if (numThreeQuaterHourLessons === 0) {
                numThreeQuaterHourLessons--;
                slot = 0;
            }

            for (var instructor = nextInstructorStart; instructor < grid.length; instructor++) {
                if (numThreeQuaterHourLessons === -1 && this.hasBothTypes) {
                    numThreeQuaterHourLessons--;
                    instructor = 0;
                }

                if (grid[instructor][slot] === 0 && grid[instructor][slot + 1] === 0) {
                    if (slot < grid[0].length - 2 && grid[instructor][slot + 2] === 0 && numThreeQuaterHourLessons > 0) {
                        grid[instructor][slot] = 2;
                        grid[instructor][slot + 1] = 2;
                        grid[instructor][slot + 2] = 2;

                        this.generateGridArray(grid, (instructor === grid.length - 1) ? slot + 1 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons, numThreeQuaterHourLessons - 1, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;
                        grid[instructor][slot + 2] = 0;

                        increment = 0;
                    } else if (slot % 2 === 1 && numHalfHourLessons > 0) {
                        grid[instructor][slot] = 1;
                        grid[instructor][slot + 1] = 1;

                        this.generateGridArray(grid, (instructor === grid.length - 1) ? slot + 2 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons - 1, numThreeQuaterHourLessons, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;

                        increment = 1;
                    }
                }

                nextInstructorStart = 0;
            }
        }
    }

    verifyMinHoursPerInstructor(grid, minHoursPerInstructor) {
        for (var instructor = 0, success = true, numHours = 0;
             instructor < grid.length && success; instructor++,
             success &= numHours >= minHoursPerInstructor, numHours = 0) {
            for (var slot = 0; slot < grid[0].length; slot++) {
                numHours += (grid[instructor][slot] === 0) ? 0.0 : 0.25;
            }
        }

        return success;
    }

    addHosing(grid) {
        var numHoses = 0;

        for (var instructor = 0; instructor < grid.length; instructor++) {
            for (var slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] === 0) {
                    if (slot === 1 && grid[instructor][slot + 1] !== 0) {
                        return false;
                    }

                    if (
                        (slot === grid[0].length - 1 && grid[instructor][slot - 1] !== 0) ||
                        (grid[instructor][slot - 1] !== 0 && grid[instructor][slot + 1] !== 0)
                        ) {
                        grid[instructor][slot] = 3;
                        numHoses++;
                    }
                }
            }
        }

        return numHoses < 3;
    }

    removeHosing(grid) {
        for (var instructor = 0; instructor < grid.length; instructor++) {
            for (var slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] === 3) {
                    grid[instructor][slot] = 0;
                }
            }
        }
    }

    condenseGrid(grid) {
        for (var instructor = 1; instructor < grid.length; instructor++) {
            for (var slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] !== grid[instructor][slot + 1] || (grid[instructor][slot - 1] === 2 && grid[instructor][slot] === 2 && grid[instructor][slot + 1] === 2)) {
                    grid[instructor][slot] += "" + grid[instructor][slot + 1];
                }
                grid[instructor].splice(slot + 1, 1);
            }
        }

        return grid;
    }

    render() {
        return null;
    }
}

function init(data) {
    return (new GridFactory).generateGrid(data);
}

export default init;
