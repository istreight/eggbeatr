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
import Instructors from './Instructors';
import GridChecklist from './GridChecklist';
import InstructorPreferences from './InstructorPreferences';


class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.componentsWithData = [];

        // To be passed to GridFactory.
        this.controllerData = {};

        // Clear storage from query string.
        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("clearStorage") === "session") {
            sessionStorage.clear();
        }

        this.grid = JSON.parse(sessionStorage.getItem("grid") || "{}");
        this.instructors = JSON.parse(sessionStorage.getItem("instructors") || "{}");
        this.instructorPreferences = JSON.parse(sessionStorage.getItem("instructorPreferences") || "{}");
        this.lessons = JSON.parse(sessionStorage.getItem("lessons") || "{}");
        this.private = JSON.parse(sessionStorage.getItem("private") || "{}");

        this.renderComponents();
    }

    /**
     * Renders the major components to static div tags.
     * Callback functions are passed to each of these components along with a
     *  reference to the Controller object.
     */
    renderComponents() {
        var grid;
        var header;
        var lessons;
        var privates;
        var instructors;
        var gridChecklist;
        var instructorPreferences;

        console.log("rendering components...");

        // Render components to static div tags.
        ReactDOM.render(<Header />, document.getElementById('dynamicHeader'));
        ReactDOM.render(<Landing />, document.getElementById('dynamicLanding'));
        ReactDOM.render(<About />, document.getElementById('dynamicAbout'));
        ReactDOM.render(<Footer />, document.getElementById('dynamicFooter'));

        grid = ReactDOM.render(<Grid
            callback={this.gridCallback}
            controller={this}
            controllerData={this.manipulateData()}
        />, document.getElementById('dynamicGrid'));
        this.componentsWithData.push(grid);

        gridChecklist = ReactDOM.render(<GridChecklist />, document.getElementById('dynamicGridChecklist'));
        this.componentsWithData.push(gridChecklist);

        instructorPreferences = ReactDOM.render(<InstructorPreferences
            callback={this.instructorPreferencesCallback}
            controller={this}
        />, document.getElementById('dynamicInstructorPreferences'));
        this.componentsWithData.push(instructorPreferences);

        instructors = ReactDOM.render(<Instructors
            callback={this.instructorsCallback}
            controller={this}
            instructorPreferences={instructorPreferences}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicInstructors'));
        this.componentsWithData.push(instructors);

        lessons = ReactDOM.render(<Lessons
            callback={this.lessonsCallback}
            controller={this}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicLessons'));
        this.componentsWithData.push(lessons);

        privates = ReactDOM.render(<Private
            callback={this.privateCallback}
            controller={this}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicPrivate'));
        this.componentsWithData.push(privates);

        header = ReactDOM.render(<Header
            callback={this.headerCallback}
            controller={this}
        />, document.getElementById('dynamicHeader'));
        this.componentsWithData.push(header);

        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("clearSet")) {
            var clearSet = searchParams.get("clearSet");

            this.removeSetFromComponents(clearSet);
        }
    }

    /**
     * Callback to store data from Grid.js
     */
     gridCallback(_grid, controller) {
         console.log(controller);
         console.log("retrieving data from Grid.js...");

         console.log("grid: ", controller.grid);
         controller.grid = jQuery.extend(true, {}, _grid);
         console.log("grid: ", controller.grid);

         console.log("adding data from Grid.js to controllerData...");

         controller.manipulateData();
     }

    /**
     * Callback to store data from Instructors.js
     */
    instructorsCallback(_instructor, controller) {
        console.log("retrieving data from Instructors.js...");

        console.log("instructors: ", controller.instructors);
        controller.instructors = jQuery.extend(true, {}, _instructor);
        console.log("instructors: ", controller.instructors);

        console.log("adding data from Instructors.js to controllerData...");

        controller.manipulateData();
    }

    /**
     * Callback to store data from InstructorsPreferences.js
     */
    instructorPreferencesCallback(_instructorPreference, controller) {
        console.log("retrieving data from InstructorsPreferences.js...");

        console.log("instructorPreferences: ", controller.instructorPreferences);
        controller.instructorPreferences = jQuery.extend(true, {}, _instructorPreference);
        console.log("instructorPreferences: ", controller.instructorPreferences);

        console.log("adding data from InstructorsPreferences.js to controllerData...");

        controller.manipulateData();
    }

    /**
     * Callback to store data from Lessons.js
     */
    lessonsCallback(_lesson, controller) {
        console.log("retrieving data from Lessons.js...");

        console.log("lessons: ", controller.lessons);
        controller.lessons = jQuery.extend(true, {}, _lesson);
        console.log("lessons: ", controller.lessons);

        console.log("adding data from Lessons.js to controllerData...");

        controller.manipulateData();
    }

    /**
     * Callback to store data from Private.js
     */
    privateCallback(_private, controller) {
        console.log("retrieving data from Private.js...");

        console.log("private: ", controller.private);
        controller.private = jQuery.extend(true, {}, _private);
        console.log("private: ", controller.private);

        console.log("adding data from Private.js to controllerData...");

        controller.manipulateData();
    }

    /**
     * Callback to store data from Header.js
     */
    headerCallback(controller, newSetName) {
        return;
    }

    /**
     * Remove a new set from each component with data.
     */
    removeSetFromComponents(set) {
        // Go to each component and remove the key-value pair.
        for (var compontentIndex = 0; compontentIndex < this.componentsWithData.length; compontentIndex++) {
            var component = this.componentsWithData[compontentIndex];

            if (component.constructor.name === "Header") {
                component.removeSet(set);
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
            "Level 5"
        ];
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

        this.lessons.half = 0;
        this.lessons.threequarter = 0;

        for (var lesson in this.lessons) {
            if (halfLessons.includes(lesson)) {
                this.lessons.half += this.lessons[lesson];
            } else if (threeQuarterLessons.includes(lesson)) {
                this.lessons.threequarter += this.lessons[lesson];
            }
        }
    }

    /**
     * Organizes data from the Lessons, Instructors, and Private components.
     * Duration of lessons set is contained in the Grid component.
     */
    manipulateData() {
        console.log("manipulating controllerData...");

        this.minimizeData();
        this.quantifyLessonTypes();

        // Add instructors to controllerData.
        this.controllerData.instructors = jQuery.extend(true, [], Object.keys(this.instructors));

        // Add instructor instructorPreferences to controllerData.
        this.controllerData.instructorPreferences = jQuery.extend(true, {}, this.instructorPreferences);

        // Add lesson quantites and number of 1/2 & 3/4 hour lessons to controllerData.
        this.controllerData.lessons = jQuery.extend(true, {}, this.lessons);

        // Add private lessons to controllerData.
        this.controllerData.private = jQuery.extend(true, {}, this.private);

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
     *      private                 - remove private without "Yes"
     */
    minimizeData() {
        console.log("minimizing controllerData...");

        /**
         * Eliminate empty strings and arrays in instructorPreferences.
         * Eliminate instructorPreferences if all keys are full.
         */
        var isConsistent = true;
        for (var instructor in this.instructorPreferences) {
            var instructorPreferences = this.instructorPreferences[instructor];

            for (var lessonGroup = 0; lessonGroup < instructorPreferences.length; lessonGroup++) {
                for (var lesson = 0; lesson < instructorPreferences[lessonGroup].length; lesson++) {
                    isConsistent = isConsistent && (instructorPreferences[lessonGroup][lesson].charAt(0) !== "r");
                }
            }

            // Delete key-value pairing if all values are filled or empty.
            if (isConsistent) {
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
        for (var instructor in this.private) {
            if (jQuery.isEmptyObject(this.private[instructor])) {
                delete this.private[instructor];
            }
        }

        this.updateSessionStorage();
    }

    /**
     * Set the gathered data in sessionStorage.
     */
    updateSessionStorage() {
        sessionStorage.setItem("grid", JSON.stringify(this.grid));
        sessionStorage.setItem("instructors", JSON.stringify(this.instructors));
        sessionStorage.setItem("instructorPreferences", JSON.stringify(this.instructorPreferences));
        sessionStorage.setItem("lessons", JSON.stringify(this.lessons));
        sessionStorage.setItem("private", JSON.stringify(this.private));
    }
}

export default Controller;
