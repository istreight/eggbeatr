/**
 * FILENAME:    Private.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the Private class for the collection
 *  of private lessons for the web application.
 * The Private class is exported.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Tutorial from 'specializations/Tutorial';
import PrivatesTable from 'specializations/PrivatesTable';
import SectionDescription from 'specializations/SectionDescription';


class Private extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        this.setState(this.props.initData, this.init);
    }

    componentDidMount() {
        return;
    }

    /**
     * Initialize the class members.
     */
    init() {
        this.displayComponentState();

        this.props.callback(this.state, "privates", false);
        this.props.setChecklistQuantity("privates", this.getComponentQuantity());
    }

    /**
     * Places the private table in a state where the
     *  contents of the table can be changed.
     * The data in the input field will replace any data
     *  that was previously in the table cell.
     * Leaving any input field empty will not replace the
     *  original data.
     */
    editPrivate() {
        // Set state to update values for placeholders in PrivatesTable props.
        this.setState(this.state);

        // Re-name and re-bind 'Edit Instructors' button.
        this.editButton.setState({
            "data": "Finish Editing",
            "handleClick": this.finishEditingPrivate.bind(this)
        }, () => this.privatesTable.toggleState(true));
    }

    /**
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its
     *  original data.
     */
    finishEditingPrivate() {
        // Re-name and re-bind 'Finish Editing' button.
        this.editButton.setState({
            "data": "Edit Privates",
            "handleClick": this.editPrivate.bind(this)
        }, () => this.privatesTable.toggleState(false));

        this.props.callback(this.state, "privates", true);
        this.props.setChecklistQuantity("privates", this.getComponentQuantity());
    }

    /**
     * Transforms an array to a PureCSS table.
     */
    displayComponentState() {
        this.sortPrivates([this.state.data]);
    }

    /**
     * Count the number of private lessons.
     */
    getComponentQuantity() {
        var numPrivate = 0;

        for (var instructor in this.state.data) {
            numPrivate += this.state.data[instructor].length;
        }

        return numPrivate;
    }

    /**
     * Given the name of an instructor, return the instructor's ID.
     */
    getInstructorIdByName(instructorName) {
        if (instructorName in this.state.data) {
            var privateLesson = this.state.data[instructorName][0];

            return new Promise((resolve, reject) => resolve(privateLesson.instructorId));
        } else {
            return this.props.connector.getInstructorData()
                .then((res) => {
                    var instructors = res.data;
                    var instructor = instructors[instructorName];

                    return instructor.id;
                }).catch(error => console.error(error));
        }
    }

    /**
     * Find the private object & instructor name by id.
     */
    findPrivateById(id) {
        var privatesId = parseInt(id, 10);

        for (var instructorName in this.state.data) {
            var _private = this.state.data[instructorName];

            for (var i = 0; i < _private.length; i++) {
                if (_private[i].id === privatesId) {
                    return [_private[i], instructorName, i];
                }
            }
        }

        return [false, "", -1];
    }

    /**
     * Sort object keys alphabetically into the state.
     */
    sortPrivates(privates) {
        var obj = {};
        var allKeys = [];

        // Extract keys from the new set of privates.
        for (var i = 0; i < privates.length; i++) {
            allKeys = allKeys.concat(Object.keys(privates[i]));
        }

        // Eliminate duplicate keys.
        allKeys = Array.from(new Set(allKeys));

        allKeys.sort().forEach((key) => {
            obj[key] = [];

            for (var i = 0; i < privates.length; i++) {
                if (key in privates[i]) {
                    var sortedTimes = this.sortPrivatesByTime(privates[i][key]);
                    obj[key] = obj[key].concat(sortedTimes);
                }
            }
        });

        this.setState({
            "data": obj
        });
    }

    /**
     * Sort object by time attribute.
     */
    sortPrivatesByTime(privates) {
        if (privates.length === 1) {
            return privates;
        }

        var obj = [];
        var allTimes = [];

        for (var i = 0; i < privates.length; i++) {
            allTimes.push(privates[i].time);
        }

        // Eliminate duplicate keys.
        allTimes = Array.from(new Set(allTimes));

        allTimes.sort((firstEl, secondEl) => {
            var [firstHour, firstSeconds] = firstEl.split(":");
            var [secondHour, secondSeconds] = secondEl.split(":");

            if (parseInt(firstHour) === parseInt(secondHour)) {
                return parseInt(firstSeconds) < parseInt(secondSeconds);
            } else {
                return parseInt(firstHour) > parseInt(secondHour);
            }
        }).forEach((time) => {
            for (var i = 0; i < privates.length; i++) {
                if (time === privates[i].time) {
                    obj.push(privates[i]);
                }
            }
        });

        return obj;
    }

    getTableBody() {
        var tableBody = [];

        for (var instructorName in this.state.data) {
            var instructor = this.state.data[instructorName];

            for (var lessonIndex = 0; lessonIndex < instructor.length; lessonIndex++) {
                var privateLesson = instructor[lessonIndex];
                var tableRow = [
                    privateLesson.id,
                    instructorName,
                    privateLesson.time,
                    privateLesson.duration
                ];

                tableBody.push(tableRow);
            }
        }

        return tableBody;
    }

    getTableHeader() {
        return [[
            "Instructor",
            "Time",
            "Duration"
        ]];
    }

    /**
     * Add a private lesson to the state and database via the Add button in the Instructors table.
     */
    addPrivateLesson(privateLessonBody) {
        return this.getInstructorIdByName(privateLessonBody.instructor)
            .then((res) => {
                // Get instructor ID by instructor name.
                privateLessonBody.duration = parseInt(privateLessonBody.duration, 10);
                privateLessonBody.instructorId = res;
                delete privateLessonBody.instructor;
            })
            .then(() => this.props.createComponent(privateLessonBody, "Privates"))
            .then((res) => {
                this.sortPrivates([this.state.data, res.data]);

                return res;
            }).catch(error => console.error(error));
    }

    /**
     * Remove a private lesson from the state via instructor ID passed by the Remove button.
     */
    removePrivateLesson(instructorId) {
        var privateLessons = JSON.parse(JSON.stringify(this.state.data));

        for (var instructorName in privateLessons) {
            var lessonArray = privateLessons[instructorName];

            for (var lessonIndex = 0; lessonIndex < lessonArray.length; lessonIndex++) {
                var lesson = lessonArray[lessonIndex];

                if (lesson.id === instructorId) {
                    this.props.removeComponent(instructorId, "Privates").then((res) => {
                        // Remove the  private lesson.
                        lessonArray.splice(lessonIndex, 1);

                        // Remove the instructor if there are no private lessons.
                        if (lessonArray.length === 0) {
                            delete privateLessons[instructorName];
                        }

                        this.setState({
                            "data": privateLessons
                        }, () => this.privatesTable.toggleState(true));
                    });

                    break;
                }
            }
        }
    }

    /**
     * Update values from the PrivatesTable to the state and the database via the input fields in the table.
     */
    updatePrivateLesson(id, newDataRow) {
        var privateLessons = this.state.data;
        var newInstructorName = newDataRow[0];
        var privateLesson, instructorName, lessonIndex;
        var privateLessonBody = {
            "time": newDataRow[1],
            "duration": newDataRow[2]
        };

        [privateLesson, instructorName, lessonIndex] = this.findPrivateById(id);

        //Apply updates to time and duration.
        Object.assign(privateLesson, privateLessonBody);

        if (instructorName === newInstructorName) {
            this.props.callback(this.state, "privates", true);
        } else {
            this.getInstructorIdByName(newInstructorName)
                .then((newInstructorId) => {
                    if (newInstructorName in privateLessons) {
                        // Add to new instructor.
                        privateLesson.instructorId = newInstructorId;
                        privateLessons[newInstructorName].push(privateLesson);

                        // Remove from old instructor.
                        privateLessons[instructorName].splice(lessonIndex, 1);

                        // Remove the instructor if there are no private lessons.
                        if (privateLessons[instructorName].length === 0) {
                            delete privateLessons[instructorName];
                        }
                    } else {
                        privateLesson.instructorId = newInstructorId;
                    }

                    this.props.callback(this.state, "privates", true);
                }).catch(error => console.error(error));
        }
    }

    /**
     * Set the reference to subcomponent references.
     */
    setComponentReference(name, reference) {
        this[name] = reference;
    }

    render() {
        return (
                <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
                    <h2 className="content-head content-head-ribbon">
                        Private Lessons
                    </h2>
                    <SectionDescription
                        additionalData={ [] }
                        anchorCallback={ (ref) => this.setComponentReference("editButton", ref) }
                        anchorHandleClick={ this.editPrivate.bind(this) }
                        buttonText={ "Edit Privates" }
                        data={ [
                            "Organize private lessons from the set",
                            "Specify the who, when, and how long",
                            "Modify their frequencies"
                        ] }
                        title={ "Detail private lessons" }
                        type={ "ribbon" }
                    />
                    <PrivatesTable
                        addCallback={ this.addPrivateLesson.bind(this) }
                        callback={ (ref) => this.setComponentReference("privatesTable", ref) }
                        dataBody={ this.getTableBody() }
                        dataHeader={ this.getTableHeader() }
                        removeCallback={ this.removePrivateLesson.bind(this) }
                        sectionId={ "dynamicPrivate" }
                        updateCallback={ this.updatePrivateLesson.bind(this) }
                    />
                    <Tutorial
                        buttonClass={ "pure-button pure-button-primary" }
                        callback={ () => null }
                        data={ "List any private lessons occuring during this set." }
                        headingClass={ "content-head content-head-ribbon" }
                        nextName={ "dynamicGrid" }
                        step={ 3 }
                        wrapperClass={ "ribbon-section-footer hide" }
                    />
                </div>
        );
    }
}

Private.propTypes =  {
    callback: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    connector: PropTypes.object.isRequired,
    createComponent: PropTypes.func.isRequired,
    removeComponent: PropTypes.func.isRequired,
    setChecklistQuantity: PropTypes.func.isRequired
}

export default Private;
