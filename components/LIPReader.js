/**
 * FILENAME:    LIPReader.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 8th, 2016
 *
 * This file contains the LIPReader class that renders the Lessons, Instrutors,
 * and Private sections of the lesson calendar web application.
 * This class requires input props.
 * A function, not React class, is exported.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Instructors from './Instructors';
import InstructorPreferences from './InstructorPreferences';
import Lessons from './Lessons';
import Private from './Private';

class LIPReader extends React.Component {
    constructor(props) {
        super(props);

        // To be passed to GridFactory.
        this.lipData = {};

        // Clear storage from query string.
        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("clearStorage") === "session") {
            sessionStorage.clear();
        }

        this.instructors = JSON.parse(sessionStorage.getItem("instructors") || "{}");
        this.instructorPreferences = JSON.parse(sessionStorage.getItem("instructorPreferences") || "{}");
        this.lessons = JSON.parse(sessionStorage.getItem("lessons") || "{}");
        this.private = JSON.parse(sessionStorage.getItem("private") || "{}");
    }

    /**
     * Renders the Instructors, Lessons, and Private components to
     *  static div tags.
     * Callback functions are passed to each of these components along with a
     *  reference to the LIPReader object.
     */
    renderComponents(gridChecklist) {
        console.log("rendering Lessons, Instructors, & Private...");

        var instructorPreferences = ReactDOM.render(<InstructorPreferences
            callback={this.instructorPreferencesCallback}
            lipReader={this}
        />, document.getElementById('dynamicInstructorPreferences'));

        ReactDOM.render(<Instructors
            callback={this.instructorsCallback}
            lipReader={this}
            instructorPreferences={instructorPreferences}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicInstructors'));

        ReactDOM.render(<Lessons
            callback={this.lessonsCallback}
            lipReader={this}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicLessons'));

        ReactDOM.render(<Private
            callback={this.privateCallback}
            lipReader={this}
            gridChecklist={gridChecklist}
        />, document.getElementById('dynamicPrivate'));
    }

    /**
     * Callback to store data from Instructors.js
     */
    instructorsCallback(_instructor, lipReader) {
        console.log("retrieving data from Instructors.js...");

        console.log("instructors: ", lipReader.instructors);
        lipReader.instructors = jQuery.extend(true, {}, _instructor);
        console.log("instructors: ", lipReader.instructors);

        console.log("adding data from Instructors.js to lipData...");

        lipReader.manipulateData();
    }

    /**
     * Callback to store data from InstructorsPreferences.js
     */
    instructorPreferencesCallback(_instructorPreference, lipReader) {
        console.log("retrieving data from InstructorsPreferences.js...");

        console.log("instructorPreferences: ", lipReader.instructorPreferences);
        lipReader.instructorPreferences = jQuery.extend(true, {}, _instructorPreference);
        console.log("instructorPreferences: ", lipReader.instructorPreferences);

        console.log("adding data from InstructorsPreferences.js to lipData...");

        lipReader.manipulateData();
    }

    /**
     * Callback to store data from Lessons.js
     */
    lessonsCallback(_lesson, lipReader) {
        console.log("retrieving data from Lessons.js...");

        console.log("lessons: ", lipReader.lessons);
        lipReader.lessons = jQuery.extend(true, {}, _lesson);
        console.log("lessons: ", lipReader.lessons);

        console.log("adding data from Lessons.js to lipData...");

        lipReader.manipulateData();
    }

    /**
     * Callback to store data from Private
     */
    privateCallback(_private, lipReader) {
        console.log("retrieving data from Private.js...");

        console.log("private: ", lipReader.private);
        lipReader.private = jQuery.extend(true, {}, _private);
        console.log("private: ", lipReader.private);

        console.log("adding data from Private.js to lipData...");

        lipReader.manipulateData();
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
        console.log("manipulating lipData...");

        this.minimizeData();
        this.quantifyLessonTypes();

        // Add instructors to lipData.
        this.lipData.instructors = jQuery.extend(true, [], Object.keys(this.instructors));

        // Add instructor instructorPreferences to lipData.
        this.lipData.instructorPreferences = jQuery.extend(true, {}, this.instructorPreferences);

        // Add lesson quantites and number of 1/2 & 3/4 hour lessons to lipData.
        this.lipData.lessons = jQuery.extend(true, {}, this.lessons);

        // Add private lessons to lipData.
        this.lipData.private = jQuery.extend(true, {}, this.private);

        return this.lipData;
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
        console.log("minimizing lipData...");

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
        sessionStorage.setItem("instructors", JSON.stringify(this.instructors));
        sessionStorage.setItem("instructorPreferences", JSON.stringify(this.instructorPreferences));
        sessionStorage.setItem("lessons", JSON.stringify(this.lessons));
        sessionStorage.setItem("private", JSON.stringify(this.private));
    }

    render() {
        return null;
    }
}

export default LIPReader;
