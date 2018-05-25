/**
 * FILENAME:    Controller.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 30th, 2017
 *
 * This file contains the Controller class that renders the major components
 *  of the lesson calendar web application.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Grid from './Grid';
import About from './About';
import Header from './Header';
import Footer from './Footer';
import Landing from './Landing';
import Lessons from './Lessons';
import Private from './Private';
import Connector from './Connector';
import Instructors from './Instructors';
import GridChecklist from './GridChecklist';
import InstructorPreferences from './InstructorPreferences';


class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.components = {};
        this.controllerData = {};
        this.serverURI = 'http://localhost:8081';
        this.connector = new Connector({
            serverURI: this.serverURI
        });

        this.init().then(() => this.renderComponents());
    }

    /**
     * Send requests to get initial data for the components.
     */
    init() {
        var populate = this.getPopulateParameter();

        var initializations = [
            this.connector.getHeaderData(populate).then(res => this.initComponentData("header", res)),
            this.connector.getGridData(populate).then(res => this.initComponentData("grid", res)),
            this.connector.getInstructorData(populate).then(res => this.initComponentData("instructors", res)),
            this.connector.getLessonData(populate).then(res => this.initComponentData("lessons", res)),
            this.connector.getPreferenceData(populate).then(res => this.initComponentData("instructorPreferences", res)),
            this.connector.getPrivatesData(populate).then(res => this.initComponentData("privates", res))
        ];

        return Promise.all(initializations)
            .catch(error => console.error(error));
    }

    /**
     * Store the data locally, as returned from the
     *  asynchronous call.
     */
    initComponentData(classVariable, res) {
        this[classVariable] = res;
    }

    /**
     * Get parameter from the query string, detailing how
     *  to seed the starting data.
     */
    getPopulateParameter() {
        var validPopulates = ["db", "default", "none"];
        var searchParams = new URLSearchParams(location.search);

        var populate = searchParams.get("populate");

        if (!(validPopulates.includes(populate))) {
            populate = "db";
        }

        return populate;
    }

    /**
     * Renders the major components to static div tags.
     * Callback functions are passed to each of these components along with a
     *  reference to the Controller object.
     */
    renderComponents() {
        console.log("rendering components...");

        // Render components to static div tags.
        ReactDOM.render(<Landing />, document.getElementById('dynamicLanding'));
        ReactDOM.render(<About />, document.getElementById('dynamicAbout'));
        ReactDOM.render(<Footer />, document.getElementById('dynamicFooter'));

        this.components.header = ReactDOM.render(<Header
            callback={this.componentCallback.bind(this)}
            initData={this.header}
            createComponent={this.createComponent.bind(this)}
            removeComponent={this.removeComponent.bind(this)}
        />, document.getElementById('dynamicHeader'));

        this.components.grid = ReactDOM.render(<Grid
            callback={this.componentCallback.bind(this)}
            initData={this.grid}
            connector={this.connector}
            createComponent={this.createComponent}
            removeComponent={this.removeComponent}
        />, document.getElementById('dynamicGrid'));

        this.components.gridChecklist = ReactDOM.render(<GridChecklist
            createGridHandler={this.components.grid.generateGrid.bind(this.components.grid)}
        />, document.getElementById('dynamicGridChecklist'));

        this.components.instructorPreferences = ReactDOM.render(<InstructorPreferences
            callback={this.componentCallback.bind(this)}
            initData={this.instructorPreferences}
            connector={this.connector}
        />, document.getElementById('dynamicInstructorPreferences'));

        this.components.instructors = ReactDOM.render(<Instructors
            callback={this.componentCallback.bind(this)}
            initData={this.instructors}
            connector={this.connector}
            instructorPreferences={this.components.instructorPreferences}
            createComponent={this.createComponent}
            removeComponent={this.removeComponent}
            setChecklistQuantity={this.components.gridChecklist.setQuantity.bind(this.components.gridChecklist)}
        />, document.getElementById('dynamicInstructors'));

        this.components.lessons = ReactDOM.render(<Lessons
            callback={this.componentCallback.bind(this)}
            initData={this.lessons}
            connector={this.connector}
            createComponent={this.createComponent}
            removeComponent={this.removeComponent}
            setChecklistQuantity={this.components.gridChecklist.setQuantity.bind(this.components.gridChecklist)}
        />, document.getElementById('dynamicLessons'));

        this.components.privates = ReactDOM.render(<Private
            callback={this.componentCallback.bind(this)}
            connector={this.connector}
            initData={this.privates}
            createComponent={this.createComponent}
            removeComponent={this.removeComponent}
            setChecklistQuantity={this.components.gridChecklist.setQuantity.bind(this.components.gridChecklist)}
        />, document.getElementById('dynamicPrivate'));
    }

    /**
     * Store component data locally.
     */
    componentCallback(component, componentName, updateDatabase) {
        console.log("retrieving data from " + componentName + ".js...");

        console.log(componentName + ": ", this[componentName]);
        this[componentName] = jQuery.extend(true, {}, component);
        console.log(componentName + ": ", this[componentName]);

        console.log("adding data from " + componentName + ".js to controllerData...");

        if (componentName === "header") {
            this.connector.setHeaderId(component.selectedSet.id);
            return this.init().then(() => this.updateComponents(updateDatabase));
        } else {
            return this.manipulateData(componentName, updateDatabase);
        }
    }

    /**
     * Update the compoents' data and the UI representation of the data.
     */
    updateComponents(updateComponent) {
        if (!updateComponent) {
            return;
        }

        for (var name in this.components) {
            var comp = this.components[name];

            if (name === "header") {
                continue;
            }

            if (this[name] !== undefined) {
                if (name === "instructorPreferences") {
                    comp.preferences = this[name];
                } else if (name === "grid") {
                    comp.grid = this[name];

                    comp.setLessonTimes();
                } else if (name === "instructors") {
                    comp.instructors = this[name];

                    this.components.gridChecklist.setQuantity(
                        "instructors",
                        comp.getNumInstructors()
                    );

                    comp.generateInstructorTable();
                } else if (name === "lessons") {
                    comp.lessonSet = this[name];

                    this.components.gridChecklist.setQuantity(
                        "lessons",
                        comp.getNumLessons()
                    );

                    comp.setLessonValues();
                } else if (name === "privates") {
                    comp.privateLessons = this[name];

                    this.components.gridChecklist.setQuantity(
                        "privates",
                        comp.getNumPrivates()
                    );

                    comp.generatePrivate();
                }
            }
        }
    }

    /**
     * Sums the number of 1/2-hour lesson types and 3/4-hour lesson types.
     */
    quantifyLessonTypes() {
        var halfLessons = [
            "Starfish",
            "Duck",
            "Sea Turtle",
            "Sea Otter",
            "Salamander",
            "Sunfish",
            "Crocodile",
            "Whale",
            "Level 1",
            "Level 2",
            "Level 3",
            "Level 4",
            "Level 5",
            "Simple Set"
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

        this.lessons.half = 0;
        this.lessons.threequarter = 0;

        for (var lesson in this.lessons) {
            if (halfLessons.includes(lesson)) {
                this.lessons.half += this.lessons[lesson].quantity;
            } else if (threeQuarterLessons.includes(lesson)) {
                this.lessons.threequarter += this.lessons[lesson].quantity;
            }
        }
    }

    checkWSIExpiration(expiryTime) {
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        return Date.parse(expiryTime) > Date.now() + sixtyDaysInMilliseconds;
    }

    /**
     * Organizes data from the Lessons, Instructors, and Private components.
     * Duration of lessons set is contained in the Grid component.
     */
    manipulateData(componentName, updateDatabase) {
        console.log("manipulating controllerData...");

        if (updateDatabase) {
            this.minimizeData(componentName);
        }

        this.quantifyLessonTypes();

        // Add instructors to controllerData.
        this.controllerData.instructors = jQuery.extend(true, {}, this.instructors);

        // Add instructor instructorPreferences to controllerData.
        this.controllerData.instructorPreferences = jQuery.extend(true, {}, this.instructorPreferences);

        // Array of valid instructors.
        var instructorsArray = Object.keys(this.controllerData.instructors);
        instructorsArray = instructorsArray.filter((instructorName) => {
            var instructor = this.controllerData.instructors[instructorName];

            return this.checkWSIExpiration(instructor.wsiExpiration);
        });
        this.controllerData.instructorsArray = instructorsArray;

        // Add lesson quantites and number of 1/2 & 3/4 hour lessons to controllerData.
        this.controllerData.lessons = jQuery.extend(true, {}, this.lessons);

        // Add private lessons to controllerData.
        this.controllerData.private = jQuery.extend(true, {}, this.privates);

        return this.controllerData;
    }

    /**
     * Reduces the size of the objects to be passed to GridFactory.
     *
     * Reductions:
     *      instructors             - no reductions
     *      instructorPreferences   - remove keys for empty pairings
     *                              - remove if all/no preferences exist
     *      lessons                 - remove keys for empty pairings
     *      private                 - remove empty private lessons
     */
    minimizeData(database) {
        console.log("minimizing controllerData...");

        /**
         * Eliminate empty strings and arrays in instructorPreferences.
         * Eliminate instructorPreferences if all keys are full.
         */
        for (var instructor in this.instructorPreferences) {
            var instructorPreferences = this.instructorPreferences[instructor];

            // Delete key-value pairing if all values are filled or empty.
            if (instructorPreferences.length === 0 || instructorPreferences.length === 21) {
                delete this.instructorPreferences[instructor];
            }
        }

        // Remove keys in lessons paired with the empty string.
        for (var value in this.lessons) {
            if (this.lessons[value] === 0) {
                delete this.lessons[value];
            }
        }

        // Remove instructors in Privates without private lessons.
        for (var instructor in this.privates) {
            if (jQuery.isEmptyObject(this.privates[instructor])) {
                delete this.privates[instructor];
            }
        }

        this.updateDatabase(database);
    }

    /**
     * Set the gathered data in the database.
     */
    updateDatabase(database) {
        console.log("Sending updates to database \"" + database + "\"...");

        if (database === "grid") {
            this.connector.updateGridData(this.grid.id, this.grid)
                .then(gridRes => console.log("Updated Grid:", gridRes));
        } else if (database === "instructors") {
            var instructorUpdates = [];
            for (var key in this.instructors) {
                var instructor = this.instructors[key];
                var id = instructor.id;
                var body = {
                    "instructor": key,
                    "dateOfHire": instructor.dateOfHire,
                    "privateOnly": instructor.privateOnly,
                    "wsiExpiration": instructor.wsiExpiration
                };

                instructorUpdates.push(this.connector.updateInstructorData(id, body));
            }

            Promise.all(instructorUpdates).then((instructorRes) => {
                this.instructors = this.assignUpdates(instructorRes);

                console.log("Updated Instructors:", this.instructors);
            });
        } else if (database === "lessons") {
            var lessonsUpdates = [];
            for (var key in this.lessons) {
                if (key === "half" || key === "threequarter") {
                    continue;
                }

                var lesson = this.lessons[key];
                var id = lesson.id;
                var body = {
                    "quantity": lesson.quantity
                };

                lessonsUpdates.push(this.connector.updateLessonData(id, body));
            }

            Promise.all(lessonsUpdates).then((lessonRes) => {
                this.lessons = this.assignUpdates(lessonRes);

                console.log("Updated Lessons:", this.lessons);
            });
        } else if (database === "instructorPreferences") {
            var preferenceUpdates = [];
            for (var key in this.instructorPreferences) {
                var preference = this.instructorPreferences[key];
                var id = preference.id;
                var body = {
                    "instructorId": preference.instructorId,
                    "lessons": preference.lessons
                };

                preferenceUpdates.push(this.connector.updatePreferenceData(id, body));
            }

            Promise.all(preferenceUpdates).then((preferenceRes) => {
                this.instructorPreferences = this.assignUpdates(preferenceRes);

                console.log("Updated InstructorPreferences:", this.instructorPreferences);
            });
        } else if (database === "privates") {
            var privateUpdates = [];
            for (var key in this.privates) {
                var privateInstructor = this.privates[key];

                for (var i = 0; i < privateInstructor.length; i++) {
                    var privateLesson = privateInstructor[i];
                    var id = privateLesson.id;
                    var body = {
                        "duration": privateLesson.duration,
                        "instructorId": privateLesson.instructorId,
                        "time": privateLesson.time
                    };

                    privateUpdates.push(this.connector.updatePrivatesData(id, body))
                }
            }

            Promise.all(privateUpdates).then((privateRes) => {
                this.privates = this.assignUpdates(privateRes);

                console.log("Updated Privates:", this.privates);
            });
        }

        console.log("All updates sent to \"" + database + "\".");
    }

    assignUpdates(res) {
        var object = {};

        for (var i = 0; i < res.length; i++) {
            Object.assign(object, res[i]);
        }

        return object;
    }

    /**
     * Add a component instance to the database.
     */
    createComponent(body, component) {
        var promise;

        console.log("Sending create new " + component + " request to database...");
        if (component === "Header") {
            promise = this.connector.setHeaderData(body);
        } else if (component === "Instructor") {
            promise = this.connector.setInstructorData(body);
        } else if (component === "Private") {
            promise = this.connector.setPrivatesData(body);
        } else if (component === "Grid") {
            promise = this.connector.setGridData(body);
        } else if (component === "Lesson") {
            promise = this.connector.setLessonData(body);
        }

        promise.then((res) => {
            console.log("Created new " + component + ":", res);
            return res;
        }).catch(error => console.error(error));

        console.log("Sent create new " + component + " request to database.");

        return promise;
    }

    /**
     * Remove an instructor from the database.
     */
    removeComponent(id, component) {
        var promise;

        console.log("Sending delete " + component + " request to database...");
        if (component === "Header") {
            promise = this.connector.deleteHeaderData(id);
            this.removeSetData(id);
        } else if (component === "Instructor") {
            promise = this.connector.deleteInstructorData(id);
        } else if (component === "Private") {
            promise = this.connector.deletePrivatesData(id);
        } else if (component === "Grid") {
            promise = this.connector.deleteGridData(id);
        } else if (component === "Lesson") {
            promise = this.connector.deleteLessonData(id);
        }

        promise.then((res) => {
            console.log("Deleted " + component + ":", res);
            return res;
        }).catch(error => console.error(error));

        console.log("Sent delete " + component + " request to database.");

        return promise;
    }

    /**
     * Remove all data related to the header ID.
     */
    removeSetData(headerId) {
        this.connector.setHeaderId(headerId);

        // Covers Preferences, Privates.
        var instructors = this.connector.getInstructorData()
            .then((res) => {
                for (var element in res) {
                    this.removeComponent(res[element].id, "Instructor");
                }
           });
       var grid = this.connector.getGridData()
           .then((res) => {
               for (var element in res) {
                   this.removeComponent(res.id, "Grid");
               }
           });
       var lessons = this.connector.getLessonData()
           .then((res) => {
               for (var element in res) {
                   this.removeComponent(res[element].id, "Lesson");
               }
           });
    }
}

export default Controller;
