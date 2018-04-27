/**
 * FILENAME:    Connector.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 17th, 2018
 *
 * This file contains the Connector class that links the front-end & back-end
 *  points of the application.
 * This component uses network requests to query data from the server.
 */

import React from 'react';


class Connector extends React.Component {
    constructor(props) {
        super(props);
    }

    getGridArrays(data, lessonTimes) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var payload = {
            "data": data,
            "lessonTimes": lessonTimes
        };

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
            returnValue = fetch(this.props.serverURI + '/api/grid')
                .then(res => res.json())
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

        return fetch(this.props.serverURI + '/api/grid', {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => this.formatGridRes(json))
            .catch(error => console.error(error));
    }

    formatGridRes(gridRes) {
        return {
            "lessonTimes": gridRes.lessonTimes
        };
    }

    getInstructorData(populate) {
        var returnValue;
        var defaultReturn = {
            "Alfa": {
                "id": 1,
                "dateOfHire": "2011-02-01",
                "wsiExpirationDate": "2021-04-03"
            },
            "Bravo": {
                "id": 2,
                "dateOfHire": "2012-06-05",
                "wsiExpirationDate": "2022-08-07"
            },
            "Charlie": {
                "id": 3,
                "dateOfHire": "2013-10-09",
                "wsiExpirationDate": "2023-12-11"
            }
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/instructors')
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

    setInstructorData(instructorId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/instructors/' + instructorId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => this.formatInstructorRes([json]))
            .catch(error => console.error(error));
    }

    formatInstructorRes(instructorRes) {
        var newObject = {};

        instructorRes.forEach((instructor) => {
            var newId = instructor.id;
            var newInstructor = instructor.instructor;
            var newDateOfHire = instructor.dateOfHire;
            var newWsiExpirationDate = instructor.wsiExpirationDate;

            newObject[newInstructor] = {
                "id": newId,
                "dateOfHire": newDateOfHire,
                "wsiExpirationDate": newWsiExpirationDate
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
            returnValue = fetch(this.props.serverURI + '/api/lessons')
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

    setLessonData(lessonId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/lessons/' + lessonId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => this.formatLessonsRes([json]))
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
            returnValue = fetch(this.props.serverURI + '/api/preferences')
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

    setPreferenceData(preferenceId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/preferences/' + preferenceId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => this.formatPreferenceRes([json]))
            .catch(error => console.error(error));
    }

    formatPreferenceRes(preferenceRes) {
        return fetch(this.props.serverURI + '/api/instructors')
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
            "Alfa":{
                "duration": 30,
                "id": 1,
                "instructorId": 1,
                "time": "9:00"
            },
            "Bravo": {
                "duration": 30,
                "id": 2,
                "instructorId": 2,
                "time": "9:30"
            },
            "Charlie": {
                "duration": 30,
                "id": 3,
                "instructorId": 3,
                "time": "10:00"
            }
        };

        if (populate === "default") {
            returnValue = new Promise((resolve, reject) => resolve(defaultReturn));
        } else if (populate === "none") {
            returnValue = new Promise((resolve, reject) => resolve({}));
        } else {
            returnValue = fetch(this.props.serverURI + '/api/privates')
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

    setPrivatesData(privateId, payload) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.props.serverURI + '/api/privates/' + privateId, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => this.formatPrivatesRes([json]))
            .catch(error => console.error(error));
    }

    formatPrivatesRes(privatesRes) {
        return fetch(this.props.serverURI + '/api/instructors')
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

                    newObject[newInstructor] = {
                        "duration": newDuration,
                        "id": newId,
                        "instructorId": newInstructorId,
                        "time": newTime
                    };
                });

                return newObject;
            }).catch(error => console.error(error));
    }
}

Connector.propTypes =  {
    serverURI: React.PropTypes.string.isRequired
}

export default Connector;
