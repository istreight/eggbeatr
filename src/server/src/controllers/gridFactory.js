/**
 * FILENAME:    GridFactory.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 26th, 2016
 * MIRGRATION DATE:  April 25th, 2018 (from /src/client/src/components)
 *
 * This file contains the GridFactory class that generates an array of the grid
 * for the lesson calendar web application. This class requires input props.
 * The result array from the generateGrid() function is exported.
 */


const gridFactory =  {
    gridList: null,
    lessonTimes: null,
    hasBothTypes: null,
    /**
     * LESSON CODES
     *  Empty:              0
     *  1/2 hour lesson:    1   (PAIRS)
     *  3/4 hour lesson:    2   (TRIPLETS)
     *  1/4 hour activity:  3   (SINGLE)
     *  Private lesson:     4
     */
    generateGrid(data, duration, lessonTimes) {
        console.log(data);

        this.gridList = [];
        this.lessonTimes = lessonTimes;
        this.hasBothTypes = data.lessons.half > 0 && data.lessons.threequarter > 0;


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
            numHalfLessons: data.lessons.half,
            numThreeQuarterLessons: data.lessons.threequarter,
            privates: data.private,
            instructors: data.instructors,
            duration: duration,
            minHoursPerInstructor: 0
        });
    },
    /**
     * Creates an array of Grids, with elements representing 15-minute slots
     *  via single digit codes.
     */
    fillGridList(props) {
        console.log(props);

        var grid = Array(props.instructors.length).fill(Array(4 * props.duration).fill(0));
        for (var instructor = 0; instructor < props.instructors.length; instructor++) {
            grid[instructor] = [props.instructors[instructor]].concat(grid[instructor]);
        }

        // Set private lessons slots.
        for (var privateInstructor in props.privates) {
            if (props.instructors.includes(privateInstructor)) {
                for (var privateTimeSlot in props.privates[privateInstructor]) {
                    var [startHour, startMinute] = this.lessonTimes[0].split(":");
                    var [privateHour, privateMinute] = privateTimeSlot.split(":");
                    var duration = props.privates[privateInstructor][privateTimeSlot][0];

                    privateHour = parseInt(privateHour, 10);
                    privateMinute = parseInt(privateMinute, 10);
                    startHour = parseInt(startHour, 10);
                    startMinute = parseInt(startMinute, 10);

                    if (privateHour < startHour) {
                        continue;
                    } else if (privateHour === startHour && privateMinute < startMinute) {
                        continue;
                    }

                    // Find instructor row.
                    var instructor;
                    grid.some((row, index) => {
                        if (row[0] === privateInstructor) {
                            instructor = index;
                            return true;
                        }

                        return false;
                    });

                    // Find proper time slot.
                    var slot = 1 + 4 * (privateHour - startHour) + Math.floor((privateMinute - startMinute) / 15);

                    // Number of slots private lesson will occupy.
                    var numSlots = Math.floor(duration / 15);

                    // Allocate slot for private.
                    if (slot + numSlots < grid[instructor].length + 1) {
                        grid[instructor].fill(4, slot, slot + numSlots);
                    }
                }
            }
        }

        this.generateGridArray(grid, 0, 0, props.numHalfLessons, props.numThreeQuarterLessons, props.minHoursPerInstructor);

        console.log("Number of Grids:", this.gridList.length);

        return this.gridList;
    },
    generateGridArray(grid, nextSlotStart, nextInstructorStart, numHalfHourLessons, numThreeQuarterHourLessons, minHoursPerInstructor) {
        if (grid.length === 0 || grid[0].length === 0) {
            return;
        }

        if (numHalfHourLessons < 1 && numThreeQuarterHourLessons < 1) {
            if (this.verifyMinHoursPerInstructor(grid, minHoursPerInstructor) && this.addHose(grid)) {
                this.gridList.push(
                    this.condenseGrid(
                        [["Instructor"].concat(this.lessonTimes)].concat(JSON.parse(JSON.stringify(grid)))
                    )
                );
            }

            this.removeHose(grid);

            return;
        }

        for (var slot = nextSlotStart, increment = 0; slot < grid[0].length - 1; slot += 1 + increment) {
            if (numThreeQuarterHourLessons === 0) {
                numThreeQuarterHourLessons--;
                slot = 0;
            }

            for (var instructor = nextInstructorStart; instructor < grid.length; instructor++) {
                if (numThreeQuarterHourLessons === -1 && this.hasBothTypes) {
                    numThreeQuarterHourLessons--;
                    instructor = 0;
                }

                if (grid[instructor][slot] === 0 && grid[instructor][slot + 1] === 0) {
                    if (slot < grid[0].length - 2 && grid[instructor][slot + 2] === 0 && numThreeQuarterHourLessons > 0) {
                        grid[instructor][slot] = 2;
                        grid[instructor][slot + 1] = 2;
                        grid[instructor][slot + 2] = 2;

                        this.generateGridArray(grid, (instructor === grid.length - 1) ? slot + 1 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons, numThreeQuarterHourLessons - 1, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;
                        grid[instructor][slot + 2] = 0;

                        increment = 0;
                    } else if (slot % 2 === 1 && numHalfHourLessons > 0) {
                        grid[instructor][slot] = 1;
                        grid[instructor][slot + 1] = 1;

                        this.generateGridArray(grid, (instructor === grid.length - 1) ? slot + 2 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons - 1, numThreeQuarterHourLessons, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;

                        increment = 1;
                    }
                }

                nextInstructorStart = 0;
            }
        }
    },
    verifyMinHoursPerInstructor(grid, minHoursPerInstructor) {
        var success = true;

        for (var instructor = 0; instructor < grid.length; instructor++) {
            if (!success) {
                return false;
            }

            var numHours = 0;

            for (var slot = 0; slot < grid[instructor].length; slot++) {
                numHours += (grid[instructor][slot] === 0) ? 0 : 1;
            }

            success = numHours > (4 * minHoursPerInstructor - 1);
        }

        return true;
    },
    addHose(grid) {
        var numHoses = 0;

        for (var instructor = 0; instructor < grid.length; instructor++) {
            // If the first slot is a valid hose spot, reject grid.
            if (grid[instructor][1] === 0 && (grid[instructor][2] !== 0 && grid[instructor][2] !== 4)) {
                return false;
            }

            for (var slot = 1; slot < grid[instructor].length; slot++) {
                if (grid[instructor][slot] === 0) {
                    if (
                        (slot === grid[instructor].length - 1 && (grid[instructor][slot - 1] !== 0 && grid[instructor][slot - 1] !== 4))
                        ||
                        ((grid[instructor][slot - 1] !== 0 && grid[instructor][slot - 1] !== 4) && (grid[instructor][slot + 1] !== 0 && grid[instructor][slot + 1] !== 4))
                    ) {
                        grid[instructor][slot] = 3;
                        numHoses++;
                    }
                }
            }
        }

        return numHoses < 3;
    },
    removeHose(grid) {
        for (var instructor = 0; instructor < grid.length; instructor++) {
            for (var slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] === 3) {
                    grid[instructor][slot] = 0;
                }
            }
        }
    },
    condenseGrid(grid) {
        // First row is the HTML table header.
        for (var instructor = 1; instructor < grid.length; instructor++) {
            for (var slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] !== grid[instructor][slot + 1] || (grid[instructor][slot - 1] === 2 && grid[instructor][slot] === 2 && grid[instructor][slot + 1] === 2)) {
                    grid[instructor][slot] += String(grid[instructor][slot + 1]);
                }

                grid[instructor].splice(slot + 1, 1);
            }
        }

        return grid;
    }
};

module.exports = {
    create(req, res) {
        var result = gridFactory.generateGrid(req.body.data, req.body.duration, req.body.lessonTimes);

        res.status(200).send(result);
    }
};
