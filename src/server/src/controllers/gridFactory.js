/**
 * FILENAME:    GridFactory.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 26th, 2016
 * MIRGRATION DATE:  April 25th, 2018 (from /src/client/src/components)
 *
 * This file contains the GridFactory class that creates
 *  an array of the grid for the web application.
 * This class requires input data.
 */


const gridFactory =  {
    /**
     * LESSON CODES
     *  Empty:              0
     *  1/2 hour lesson:    1   (PAIRS)
     *  3/4 hour lesson:    2   (TRIPLETS)
     *  1/4 hour activity:  3   (SINGLE)
     *  Private lesson:     4
     */
    createGrid(data) {
        this.gridList = [];
        this.lessonTimes = data.lessonTimes;

        return this.fillGridList({
            numHalfLessons: data.lessons.half,
            numThreeQuarterLessons: data.lessons.threequarter,
            privates: data.private,
            instructors: data.instructorsArray,
            privateOnlyInstructors: data.privateOnlyInstructors,
            duration: data.duration,
            minHoursPerInstructor: 0
        });
    },

    /**
     * Creates an array of Grids, with elements representing 15-minute slots
     *  via single digit codes.
     */
    fillGridList(data) {
        console.log(data);

        var groupInstructors = data.instructors.filter(value => !data.privateOnlyInstructors.includes(value));

        var grid = Array(groupInstructors.length).fill(Array(4 * data.duration).fill(0));
        for (let instructor = 0; instructor < groupInstructors.length; instructor++) {
            grid[instructor] = [groupInstructors[instructor]].concat(grid[instructor]);
        }

        var privatesGrid = Array(data.privateOnlyInstructors.length).fill(Array(4 * data.duration).fill(0));
        for (let instructor = 0; instructor < data.privateOnlyInstructors.length; instructor++) {
            privatesGrid[instructor] = [data.privateOnlyInstructors[instructor]].concat(privatesGrid[instructor]);
        }

        grid = this.addPrivateLessons(grid, data, groupInstructors, privatesGrid);

        this.createGridArray(grid, 0, 0, data.numHalfLessons, data.numThreeQuarterLessons, data.minHoursPerInstructor);

        if (this.gridList.length > 0) {
            this.filterEmptyPrivateInstructors(privatesGrid);

            if (privatesGrid.length > 0) {
                this.addPrivatesOnly(privatesGrid);
            }
        }

        console.log("Number of Grids:", this.gridList.length);

        return this.gridList;
    },

    createGridArray(grid, nextSlotStart, nextInstructorStart, numHalfHourLessons, numThreeQuarterHourLessons, minHoursPerInstructor) {
        if (grid.length === 0 || grid[0].length === 0) {
            return;
        }

        if (numHalfHourLessons < 1 && numThreeQuarterHourLessons < 1) {
            if (this.verifyMinHoursPerInstructor(grid, minHoursPerInstructor) && this.addWork(grid)) {
                this.gridList.push(
                    this.condenseGrid(
                        JSON.parse(JSON.stringify(grid))
                    )
                );
            }

            this.removeWork(grid);

            return;
        }

        for (let slot = nextSlotStart, increment = 0; slot < grid[0].length - 1; slot += 1 + increment) {
            if (numThreeQuarterHourLessons === 0) {
                numThreeQuarterHourLessons--;
                slot = 0;
            }

            for (let instructor = nextInstructorStart; instructor < grid.length; instructor++) {
                if (numThreeQuarterHourLessons === -1 && numHalfHourLessons > 0) {
                    numThreeQuarterHourLessons--;
                    instructor = 0;
                }

                if (grid[instructor][slot] === 0 && grid[instructor][slot + 1] === 0) {
                    if (slot < grid[0].length - 2 && grid[instructor][slot + 2] === 0 && numThreeQuarterHourLessons > 0) {
                        grid[instructor][slot] = 2;
                        grid[instructor][slot + 1] = 2;
                        grid[instructor][slot + 2] = 2;

                        this.createGridArray(grid, (instructor === grid.length - 1) ? slot + 1 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons, numThreeQuarterHourLessons - 1, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;
                        grid[instructor][slot + 2] = 0;

                        increment = 0;
                    } else if (slot % 2 === 1 && numHalfHourLessons > 0) {
                        grid[instructor][slot] = 1;
                        grid[instructor][slot + 1] = 1;

                        this.createGridArray(grid, (instructor === grid.length - 1) ? slot + 2 : slot, (instructor < grid.length - 1) ? instructor + 1 : 0, numHalfHourLessons - 1, numThreeQuarterHourLessons, minHoursPerInstructor);

                        grid[instructor][slot] = 0;
                        grid[instructor][slot + 1] = 0;

                        increment = 1;
                    }
                }

                nextInstructorStart = 0;
            }
        }
    },

    addPrivateLessons(grid, data, groupInstructors, privatesGrid) {
        for (let privateInstructor in data.privates.data) {
            if (data.instructors.includes(privateInstructor)) {
                let privateLessons = data.privates.data[privateInstructor];

                for (let privateIndex = 0; privateIndex < privateLessons.length; privateIndex++) {
                    let privateLesson = privateLessons[privateIndex];

                    let time = privateLesson.time;
                    let duration = privateLesson.duration;

                    let [startHour, startMinute] = this.lessonTimes[0].split(":");
                    let [privateHour, privateMinute] = time.split(":");

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
                    let instructor;
                    grid.some((row, index) => {
                        if (row[0] === privateInstructor) {
                            instructor = index;

                            return true;
                        }

                        return false;
                    });

                    // Find proper time slot.
                    let slot = 1 + 4 * (privateHour - startHour) + Math.floor((privateMinute - startMinute) / 15);

                    // Number of slots private lesson will occupy.
                    let numSlots = Math.floor(duration / 15);

                    // Allocate slot for private.
                    if (groupInstructors.includes(privateInstructor)) {
                        if (slot + numSlots < grid[instructor].length + 1) {
                            grid[instructor].fill(4, slot, slot + numSlots);
                        }
                    } else if (data.privateOnlyInstructors.includes(privateInstructor)) {
                        instructor = data.privateOnlyInstructors.indexOf(privateInstructor);
                        if (slot + numSlots < privatesGrid[instructor].length + 1) {
                            privatesGrid[instructor].fill(4, slot, slot + numSlots);
                        }
                    }
                }
            }
        }

        return grid;
    },

    addPrivatesOnly(privatesGrid) {
        privatesGrid = this.condenseGrid(privatesGrid);

        for (let i = 1; i < privatesGrid.length; i++) {
            this.addPrivateInstructor(privatesGrid[i]);
        }
    },

    addPrivateInstructor(privateInstructor) {
        var instructorIndex;
        var grid = this.gridList[0];
        var lastIndex = grid.length - 1;
        var instructorName = privateInstructor[0];

        // Append instructors with names alphabetically after the last instructor in the grid.
        if (grid[lastIndex][0] < instructorName) {
            instructorIndex = lastIndex + 1;
        } else {
            for (let j = 1; j < grid.length; j++) {
                if (grid[j][0] > instructorName) {
                    instructorIndex = j;

                    break;
                }
            }
        }

        for (let i = 0; i < this.gridList.length; i++) {
            grid = this.gridList[i];

            grid.splice(instructorIndex, 0, privateInstructor);
        }
    },

    filterEmptyPrivateInstructors(privatesGrid) {
        for (let i = 0; i < privatesGrid.length; i++) {
            let isEmpty = privatesGrid[i].filter(value => value !== 0);

            if (isEmpty.length === 1) {
                privatesGrid.splice(i, 1);
            }
        }
    },

    verifyMinHoursPerInstructor(grid, minHoursPerInstructor) {
        var success = true;

        for (let instructor = 0; instructor < grid.length; instructor++) {
            if (!success) {
                return false;
            }

            let numHours = 0;

            for (let slot = 0; slot < grid[instructor].length; slot++) {
                numHours += (grid[instructor][slot] === 0) ? 0 : 1;
            }

            success = numHours > (4 * minHoursPerInstructor - 1);
        }

        return true;
    },

    addWork(grid) {
        var numWork = 0;

        for (let instructor = 0; instructor < grid.length; instructor++) {
            // If the first slot is a valid work spot, reject grid.
            if (grid[instructor][1] === 0 && (grid[instructor][2] !== 0 && grid[instructor][2] !== 4)) {
                return false;
            }

            for (let slot = 1; slot < grid[instructor].length; slot++) {
                if (grid[instructor][slot] === 0) {
                    if (
                        (slot === grid[instructor].length - 1 && grid[instructor][slot - 1] !== 0)
                        ||
                        (grid[instructor][slot - 1] !== 0 &&  grid[instructor][slot + 1] !== 0)
                    ) {
                        grid[instructor][slot] = 3;
                        numWork++;
                    }
                }
            }
        }

        return numWork < 3;
    },

    removeWork(grid) {
        for (let instructor = 0; instructor < grid.length; instructor++) {
            for (let slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] === 3) {
                    grid[instructor][slot] = 0;
                }
            }
        }
    },

    condenseGrid(grid) {
        var lessonTimes;

        for (let instructor = 0; instructor < grid.length; instructor++) {
            for (let slot = 1; slot < grid[0].length; slot++) {
                if (grid[instructor][slot] !== grid[instructor][slot + 1] || (grid[instructor][slot - 1] === 2 && grid[instructor][slot] === 2 && grid[instructor][slot + 1] === 2)) {
                    grid[instructor][slot] += String(grid[instructor][slot + 1]);
                }

                grid[instructor].splice(slot + 1, 1);
            }
        }

        lessonTimes = this.lessonTimes.slice(0, grid[0].length - 1);
        grid = [["Instructor"].concat(lessonTimes)].concat(grid);

        return grid;
    }
};

module.exports = {
    create(req, res) {
        var result = gridFactory.createGrid(req.body);

        res.status(200).send(result);
    }
};
