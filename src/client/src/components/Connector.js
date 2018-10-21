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


class Connector extends React.Component {
    constructor(props) {
        super(props);

        this.headerId = 1;
    }

    setHeaderId(newId) {
        this.headerId = newId;
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
        var defaultReturn = {
            "lessonTimes": [
                "9:00", "9:30", "10:00", "10:30", "11:00"
            ]
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/grid?headerId=' + this.headerId)
                .then(res => res.json())
                .then(json => this.formatGridRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
                }
            );
        }

        return returnValue;
    }

    setGridData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/grid?headerId=' + this.headerId, {
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

        return fetch(this.props.serverURI + '/api/grid/' + gridId + '?headerId=' + this.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatGridRes([json]))
            .catch(error => console.error(error));
    }

    deleteGridData(gridId) {
        return fetch(this.props.serverURI + '/api/grid/' + gridId + '?headerId=' + this.headerId, {
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
        var defaultReturn = {
            "selectedSet": {
                "id": 1,
                "setTitle": "Saturday"
            },
            "sets": [
                {
                    "id": 1,
                    "setTitle": "Saturday"
                },
                {
                    "id": 2,
                    "setTitle": "Sunday"
                }
            ]
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/headers')
                .then(res => res.json())
                .then(json => this.formatHeaderRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
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
            "selectedSet": {},
            "sets": []
        };

        headerRes.forEach((header, index) => {
            var newId = header.id;
            var newSetTitle = header.setTitle;
            var newHeader = {
                "id": newId,
                "setTitle": newSetTitle
            };

            if (index === 0) {
                newObject.selectedSet = newHeader;
            }

            newObject.sets.push(newHeader);
        });

        return newObject;
    }

    getInstructorData(populate) {
        var returnValue;
        var defaultReturn = {
            "Alfa": {
                "id": 1,
                "dateOfHire": "2011-02-01",
                "wsiExpiration": "2021-04-03"
            },
            "Bravo": {
                "id": 2,
                "dateOfHire": "2012-06-05",
                "wsiExpiration": "2022-08-07"
            },
            "Charlie": {
                "id": 3,
                "dateOfHire": "2013-10-09",
                "wsiExpiration": "2023-12-11"
            }
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/instructors?headerId=' + this.headerId)
                .then(res => res.json())
                .then(json => this.formatInstructorRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
                }
            );
        }

        return returnValue;
    }

    setInstructorData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.headerId, {
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

        return fetch(this.props.serverURI + '/api/instructors/' + instructorId + '?headerId=' + this.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatInstructorRes([json]))
            .catch(error => console.error(error));
    }

    deleteInstructorData(instructorId) {
        return fetch(this.props.serverURI + '/api/instructors/' + instructorId + '?headerId=' + this.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatInstructorRes(instructorRes) {
        var newObject = {};

        instructorRes.forEach((instructor) => {
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
        var defaultReturn = {
            "Starfish": {
                "id": 1,
                "quantity": 1
            },
            "Sea Otter": {
                "id": 4,
                "quantity": 1
            },
            "Level 1": {
                "id": 9,
                "quantity": 1
            },
            "Level 6": {
                "id": 14,
                "quantity": 1
            },
            "Basics I": {
                "id": 19,
                "quantity": 1
            }
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/lessons?headerId=' + this.headerId)
                .then(res => res.json())
                .then(json => this.formatLessonsRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
                }
            );
        }

        return returnValue;
    }

    setLessonData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/lessons?headerId=' + this.headerId, {
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

        return fetch(this.props.serverURI + '/api/lessons/' + lessonId + '?headerId=' + this.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatLessonsRes([json]))
            .catch(error => console.error(error));
    }

    deleteLessonData(lessonId) {
        return fetch(this.props.serverURI + '/api/lessons/' + lessonId + '?headerId=' + this.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatLessonsRes(lessonsRes) {
        var newObject = {};

        lessonsRes.forEach((lesson) => {
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
        var defaultReturn = {
            "Alfa": {
                "id": 1,
                "instructorId": 1,
                "lessons": [
                    "Starfish", "Duck", "Sea Turtle"
                ]
            },
            "Bravo": {
                "id": 2,
                "instructorId": 2,
                "lessons": [
                    "Level 1", "Level 2", "Level 3"
                ]
            },
            "Charlie": {
                "id": 3,
                "instructorId": 3,
                "lessons": [
                    "Basics I", "Basics II", "Strokes"
                ]
            }
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/preferences?headerId=' + this.headerId)
                .then(res => res.json())
                .then(json => this.formatPreferenceRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
                }
            );
        }

        return returnValue;
    }

    updatePreferenceData(preferenceId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/preferences/' + preferenceId + '?headerId=' + this.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatPreferenceRes([json]))
            .catch(error => console.error(error));
    }

    formatPreferenceRes(preferenceRes) {
        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.headerId)
            .then(res => res.json()).then((instructors) => {
                var newObject = {};

                preferenceRes.forEach((preference) => {
                    var newId = preference.id;
                    var newLessons = preference.lessons;
                    var newInstructorId = preference.instructorId;

                    var newInstructorObject = instructors.find((instructor) => {
                        return instructor.id === newInstructorId;
                    });

                    var newInstructor = newInstructorObject.instructor;

                    newObject[newInstructor] = {
                        "id": newId,
                        "instructorId": newInstructorId,
                        "lessons": newLessons
                    };
                });

                return newObject;
            }).catch(error => console.error(error));
    }

    getPrivatesData(populate) {
        var returnValue;
        var defaultReturn = {
            "Alfa": [{
                "id": 1,
                "instructorId": 1,
                "duration": 30,
                "time": "9:00:00"
            }],
            "Bravo": [{
                "id": 2,
                "instructorId": 2,
                "duration": 30,
                "time": "9:30:00"
            }],
            "Charlie": [{
                "id": 3,
                "instructorId": 3,
                "duration": 30,
                "time": "10:00:00"
            }]
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/privates?headerId=' + this.headerId)
                .then(res => res.json())
                .then(json => this.formatPrivatesRes(json))
                .catch(error => {
                    console.error(error);
                    return defaultReturn;
                }
            );
        }

        return returnValue;
    }

    setPrivatesData(payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/privates?headerId=' + this.headerId, {
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

        return fetch(this.props.serverURI + '/api/privates/' + privateId + '?headerId=' + this.headerId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(json => this.formatPrivatesRes([json]))
            .catch(error => console.error(error));
    }

    deletePrivatesData(privatesId) {
        return fetch(this.props.serverURI + '/api/privates/' + privatesId + '?headerId=' + this.headerId, {
                method: 'DELETE'
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    formatPrivatesRes(privatesRes) {
        return fetch(this.props.serverURI + '/api/instructors?headerId=' + this.headerId)
            .then(res => res.json()).then((instructors) => {
                var newObject = {};

                privatesRes.forEach((privateLesson) => {
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

                    var newInstructor = newInstructorObject.instructor;

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

Connector.propTypes =  {
    serverURI: PropTypes.string.isRequired
}

export default Connector;
