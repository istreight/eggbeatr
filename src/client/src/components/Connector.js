/**
 * FILENAME:    Connector.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 17th, 2018
 *
 * This file contains the Connector class that links the
 *  front-end & back-end  points of the application.
 * This component uses network requests to query data
 *  from the server.
 */

import React from 'react';
import PropTypes from 'prop-types';

import DefaultData from 'root/etc/defaults/ComponentData';

class Connector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "headerId": 1
        };
    }

    setHeaderId(newId) {
        this.state = {
            "headerId": newId
        };
    }

    getGridArrays(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/factory', {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(res => res.json()).catch(error => {
            console.error(error);
            return [];
        });
    }

    getGridData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(JSON.stringify(DefaultData.Grids));

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatGridRes(defaultRes);

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultRes));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/grid?headerId=' + this.state.headerId)
                .then(res => res.json())
                .then(json => this.formatGridRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    setGridData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/grid?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatGridRes([json]))
            .catch(error => console.error(error));
    }

    updateGridData(gridId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/grid/' + gridId + '?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatGridRes([json]))
            .catch(error => console.error(error));
    }

    deleteGridData(gridId) {
        return fetch(this.props.serverURI + '/api/grid/' + gridId + '?headerId=' + this.state.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatGridRes(gridRes) {
        var newObject = {};

        gridRes.forEach((grid, index) => {
            var newId = grid.id;
            var newDuration = grid.duration;
            var newLessonTimes = grid.lessonTimes;

            newObject = {
                    "id": newId,
                    "duration": newDuration,
                    "lessonTimes": newLessonTimes
            };
        });

        return newObject;
    }

    getHeaderData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(JSON.stringify(DefaultData.Headers));

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatHeaderRes(defaultRes);

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultRes));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/headers')
                .then(res => res.json())
                .then(json => this.formatHeaderRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    setHeaderData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/headers', {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatHeaderRes([json]))
            .catch(error => console.error(error));
    }

    deleteHeaderData(headerId) {
        return fetch(this.props.serverURI + '/api/headers/' + headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatHeaderRes(headerRes) {
        var newObject = {
            "data": {
                "selectedSet": {},
                "sets": []
            }
        };

        headerRes.forEach((header, index) => {
            var newId = header.id;
            var newSetTitle = header.setTitle;
            var newHeader = {
                "id": newId,
                "setTitle": newSetTitle
            };

            if (index === 0) {
                newObject.data.selectedSet = newHeader;
            }

            newObject.data.sets.push(newHeader);
        });

        return newObject;
    }

    getInstructorData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(JSON.stringify(DefaultData.Instructors));

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatInstructorRes(defaultRes);

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultRes));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/instructors?headerId=' + this.state.headerId)
                .then(res => res.json())
                .then(json => this.formatInstructorRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    setInstructorData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatInstructorRes([json]))
            .catch(error => console.error(error));
    }

    updateInstructorData(instructorId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/instructors/' + instructorId + '?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatInstructorRes([json]))
            .catch(error => console.error(error));
    }

    deleteInstructorData(instructorId) {
        return fetch(this.props.serverURI + '/api/instructors/' + instructorId + '?headerId=' + this.state.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatInstructorRes(instructorRes) {
        var newObject = {};

        instructorRes.forEach((instructor, index) => {
            var newId = instructor.id;
            var newInstructor = instructor.instructor;
            var newDateOfHire = instructor.dateOfHire;
            var newPrivateOnly = instructor.privateOnly;
            var newWsiExpiration = instructor.wsiExpiration;

            newObject[newInstructor] = {
                "id": newId,
                "dateOfHire": newDateOfHire,
                "privateOnly": newPrivateOnly,
                "wsiExpiration": newWsiExpiration
            };
        });

        return newObject;
    }

    getLessonData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(JSON.stringify(DefaultData.Lessons));

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatLessonsRes(defaultRes);

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultRes));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/lessons?headerId=' + this.state.headerId)
                .then(res => res.json())
                .then(json => this.formatLessonsRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    setLessonData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/lessons?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatLessonsRes([json]))
            .catch(error => console.error(error));
    }

    updateLessonData(lessonId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/lessons/' + lessonId + '?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatLessonsRes([json]))
            .catch(error => console.error(error));
    }

    deleteLessonData(lessonId) {
        return fetch(this.props.serverURI + '/api/lessons/' + lessonId + '?headerId=' + this.state.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatLessonsRes(lessonsRes) {
        var newObject = {};

        lessonsRes.forEach((lesson, index) => {
            var newId = lesson.id;
            var newLesson = lesson.title;
            var newQuantity = lesson.quantity;

            newObject[newLesson] = {
                "id": newId,
                "quantity": newQuantity
            };
        });

        return newObject;
    }

    getPreferenceData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(
            JSON.stringify(DefaultData.InstructorPreferences)
        );

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatPreferenceRes(defaultRes);

        if (populate === "default") {
            returnValue = defaultRes;
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/preferences?headerId=' + this.state.headerId)
                .then(res => res.json())
                .then(json => this.formatPreferenceRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    updatePreferenceData(preferenceId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/preferences/' + preferenceId + '?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatPreferenceRes([json]))
            .catch(error => console.error(error));
    }

    formatPreferenceRes(preferenceRes) {
        var defaultRes = JSON.parse(
            JSON.stringify(DefaultData.InstructorPreferences)
        );

        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.state.headerId)
            .then(res => res.json()).then((instructors) => {
                var res;
                var maxId = 0;
                var newLessons = [];
                var newObject = {
                    "data": {}
                };

                if (instructors.length === 0) {
                    return newObject;
                }

                preferenceRes.forEach((preference) => {
                    var newInstructor;
                    var newInstructorObject;
                    var newId = preference.id;
                    var newLessons = preference.lessons;
                    var newInstructorId = preference.instructorId;

                    newInstructorObject = instructors.find((instructor) => {
                        return instructor.id === newInstructorId;
                    });

                    if (!newInstructorObject) {
                        return true;
                    }

                    maxId = Math.max(newId, maxId);
                    newInstructor = newInstructorObject.instructor;

                    newObject.data[newInstructor] = {
                        "id": newId,
                        "instructorId": newInstructorId,
                        "lessons": newLessons
                    };
                });

                for (var i = 0; i < defaultRes.length; i++) {
                    res = defaultRes[i];
                    newLessons = newLessons.concat(res.lessons);
                }

                // Give full preferences to instructors without preferences.
                instructors.forEach((instructor) => {
                    var newId = maxId++;
                    var newInstructorId = instructor.id;
                    var instructorName = instructor.instructor;

                    if (instructorName in newObject.data) {
                        return true;
                    }

                    newObject.data[instructorName] = {
                        "id": newInstructorId,
                        "instructorId": newInstructorId,
                        "lessons": newLessons
                    };
                });

                return newObject;
            }).catch(error => console.error(error));
    }

    getPrivatesData(populate) {
        var returnValue;
        var defaultRes = JSON.parse(JSON.stringify(DefaultData.Privates));

        for (var i = 0; i < defaultRes.length; i++) {
            Object.assign(defaultRes[i], { "id": i + 1 });
        }

        defaultRes = this.formatPrivatesRes(defaultRes);

        if (populate === "default") {
            returnValue = defaultRes;
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/privates?headerId=' + this.state.headerId)
                .then(res => res.json())
                .then(json => this.formatPrivatesRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultRes;
                }
            );
        }

        return returnValue;
    }

    setPrivatesData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/privates?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatPrivatesRes([json]))
            .catch(error => console.error(error));
    }

    updatePrivatesData(privateId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/privates/' + privateId + '?headerId=' + this.state.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatPrivatesRes([json]))
            .catch(error => console.error(error));
    }

    deletePrivatesData(privatesId) {
        return fetch(this.props.serverURI + '/api/privates/' + privatesId + '?headerId=' + this.state.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatPrivatesRes(privatesRes) {
        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.state.headerId)
            .then(res => res.json()).then((instructors) => {
                var newObject = {};

                if (instructors.length === 0) {
                    return newObject;
                }

                privatesRes.forEach((privateLesson) => {
                    var newInstructor;
                    var newId = privateLesson.id;
                    var newTime = privateLesson.time;
                    var newDuration = privateLesson.duration;
                    var newInstructorId = privateLesson.instructorId;

                    // Strip newTime of milliseconds & leading zero.
                    var reLeadingZero = new RegExp(/^0/);
                    newTime = newTime.replace(reLeadingZero, "");

                    var newInstructorObject = instructors.find((instructor) => {
                        return instructor.id === newInstructorId;
                    });

                    if (!newInstructorObject) {
                        return true;
                    }

                    newInstructor = newInstructorObject.instructor;

                    if (newInstructor in newObject) {
                        newObject[newInstructor].push({
                            "id": newId,
                            "instructorId": newInstructorId,
                            "duration": newDuration,
                            "time": newTime
                        });
                    } else {
                        newObject[newInstructor] = [{
                            "id": newId,
                            "instructorId": newInstructorId,
                            "duration": newDuration,
                            "time": newTime
                        }];
                    }
                });

                return newObject;
            }).catch(error => console.error(error));
    }
}

Connector.propTypes = {
    serverURI: PropTypes.string.isRequired
}

export default Connector;
