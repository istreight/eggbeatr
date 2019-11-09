/**
 * FILENAME:    Instructors.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 25th, 2016
 *
 * This file contains the Intructors class for the
 *  collection of instructors for the web application.
 * The Instructors class is exported.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Tutorial from 'specializations/Tutorial';
import InstructorTable from 'specializations/InstructorTable';
import SectionDescription from 'specializations/SectionDescription';


class Instructors extends React.Component {
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

        this.props.callback(this.state, "instructors", false);
        this.props.setChecklistQuantity("instructors", this.getComponentQuantity());
    }

    /**
     * Get number of stored lessons.
     */
    getComponentQuantity() {
        var validInstructors;
        var instructorsArray = Object.keys(this.state.data);
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        // Expired & private only instructors.
        validInstructors = instructorsArray.filter((instructorName) => {
            var instructor = this.state.data[instructorName];
            var expiryTime = instructor.wsiExpiration;
            var privateOnly = instructor.privateOnly;

            return !privateOnly && Date.now() + sixtyDaysInMilliseconds <  Date.parse(expiryTime);
        });

        return validInstructors.length;
    }

    /**
     * Places the instructor table in a state where the
     *  contents of the table can be changed.
     * The data in the input field will replace any data
     *  that was previously in the table cell.
     * Leaving any input field empty will not replace the
     *  original data.
     */
    editInstructors() {
        // Set state to update values for placeholders in InstructorTable props.
        this.setState(this.state);

        // Re-name and re-bind 'Edit Instructors' button.
        this.editButton.setState({
            "data": "Finish Editing",
            "handleClick": this.finishEditingInstructors.bind(this)
        }, () => this.instructorTable.toggleTableState(true));
    }

    /**
     * Saves changes made in input fields to specific cell.
     * Empty inputs will leave the cell with its original
     *  data.
     */
    finishEditingInstructors() {
        this.editButton.setState({
            "data": "Edit Instructors",
            "handleClick": this.editInstructors.bind(this)
        }, () => this.instructorTable.toggleTableState(false));

        this.props.callback(this.state, "instructors", true);
        this.props.setChecklistQuantity("instructors", this.getComponentQuantity());
    }

    /**
     * Transforms the Instructors object to an HTML table.
     */
    displayComponentState() {
        this.sortInstructors(this.state.data);
    }

    /**
     * Add an instructor to the state via the Add button in the Instructors table.
     */
    addInstructor(instructorBody) {
        // Add to database.
        return this.props.createComponent(instructorBody, "Instructor").then((res) => {
            this.sortInstructors(Object.assign(this.state.data, res.data));

            return res;
        });
    }

    /**
     * Remove an instructor from the state via instructor ID passed by the Remove button.
     */
    removeInstructor(instructorId) {
        var instructors = JSON.parse(JSON.stringify(this.state.data));

        for (var instructorName in instructors) {
            var instructor = instructors[instructorName];

            if (instructor.id === instructorId) {
                this.props.removeComponent(instructorId, "Instructor").then((res) => {
                    delete instructors[instructorName];

                    this.setState({
                        "data": instructors
                    }, () => this.instructorTable.toggleTableState(true));
                });

                this.props.deletePreference(instructorName);

                break;
            }
        }
    }

    updateInstructor(instructorName, instructorBody, newInstructorName) {
        var instructor = this.state.data[instructorName];

        console.log("here", instructorName, newInstructorName);

        if (instructorName === newInstructorName) {
            Object.assign(instructor, instructorBody);
            Object.assign(this.state.data[instructorName], instructor);
        } else {
            // Duplicate the old instructor's data to under the new instructor's name.
            var newInstructor = {};
            newInstructor[newInstructorName] = instructor;
            Object.assign(this.state.data, newInstructor);

            // Remove the old instructor.
            delete this.state.data[instructorName];
        }

        this.props.callback(this.state, "instructors", true);
    }

    /**
     * Find the instructor object & instructor name by id.
     */
    findInstructorById(id) {
        var instructorId = parseInt(id, 10);

        for (var instructorName in this.state.data) {
            var instructor = this.state.data[instructorName];

            if (instructor.id === instructorId) {
                return [instructor, instructorName];
            }
        }

        return [false, ""];
    }

    /**
     * Get the number of stored instructors.
     */
    getNumInstructors() {
        var expiredArray;
        var instructorsArray = Object.keys(this.state.data);
        const sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;

        expiredArray = instructorsArray.filter((instructorName) => {
            var instructor = this.state.data[instructorName];
            var expiryTime = instructor.wsiExpiration;

            return Date.parse(expiryTime) < Date.now() + sixtyDaysInMilliseconds;
        });

        return instructorsArray.length - expiredArray.length;
    }

    /**
     * Sort object keys alphabetically into instructors.
     */
    sortInstructors(instructors) {
        var sorted = {};

        Object.keys(instructors).sort().forEach((key) => {
            sorted[key] = instructors[key];
        });

        this.state.data = sorted;
    }

    /**
     * Size the table based on the number of instructors.
     */
    sizeTable() {
        var cHeight;
        var newHeight;
        var instructors = Object.keys(this.state.data);
        var dynamicInstructors = document.getElementById("dynamicInstructors");

        cHeight = dynamicInstructors.clientHeight;
        newHeight = cHeight + (40 * (instructors.length - 3));

        if (instructors.length > 3) {
            dynamicInstructors.style.height = newHeight + "px";
        }
    }

    /**
     * Return an array of the values in the header of the Instructors table.
     * The return value is a two-dimensional array with one row.
     */
    getTableHeader() {
        return [[
            "Instructor",
            "Date of Hire",
            "WSI Expiration",
            "Privates Only",
            "Preferences"
        ]];
    }

    /**
     * Return an array of the values that make up the body of the Instructors table.
     * The return value is a two-dimensional array with one row for each instructor in the current state.
     */
    getTableBody() {
        var tableBody = [];

        for (var instructorName in this.state.data) {
            var instructor = this.state.data[instructorName];

            var tableRow = [
                instructorName,
                instructor.dateOfHire,
                instructor.wsiExpiration,
                {
                    "instructorId": instructor.id,
                    "privateOnly": instructor.privateOnly
                }, {
                    "instructorId": instructor.id,
                    "instructorName": instructorName
                }
            ];

            tableBody.push(tableRow);
        }

        return tableBody;
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
                    Instructors
                </h2>
                <SectionDescription
                    additionalData={ [] }
                    anchorCallback={ (ref) => this.setComponentReference("editButton", ref) }
                    anchorHandleClick={ this.editInstructors.bind(this) }
                    buttonText={ "Edit Instructors" }
                    data={ [
                        "Add or remove instructors from the set",
                        "Note the important dates",
                        "Modify their teaching preferences"
                    ] }
                    title={ "Customize the team of instructors" }
                    type={ "ribbon" }
                />
                <InstructorTable
                    addCallback={ this.addInstructor.bind(this) }
                    callback={ (ref) => this.setComponentReference("instructorTable", ref) }
                    dataBody={ this.getTableBody() }
                    dataHeader={ this.getTableHeader() }
                    removeCallback={ this.removeInstructor.bind(this) }
                    sectionId={ "dynamicInstructors" }
                    updateCallback={ this.updateInstructor.bind(this) }
                />
                <Tutorial
                    buttonClass={ "pure-button pure-button-primary" }
                    callback={ () => null }
                    data={ "List the instructors teaching in this lesson set. Once added, their individual preferences become available." }
                    headingClass={ "content-head content-head-ribbon" }
                    nextName={ "dynamicLessons" }
                    step={ 1 }
                    wrapperClass={ "ribbon-section-footer hide" }
                />
            </div>
        );
    }
}

Instructors.propTypes = {
    callback: PropTypes.func.isRequired,
    connector: PropTypes.object.isRequired,
    createComponent: PropTypes.func.isRequired,
    deletePreference: PropTypes.func.isRequired,
    handlePreferencesClick: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    removeComponent: PropTypes.func.isRequired,
    setChecklistQuantity: PropTypes.func.isRequired
}

export default Instructors;
