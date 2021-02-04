class ComponentData {
    getDefaultData() {
        return {
            "Grids": [{
                "headerId": 1,
                "duration": 1.5,
                "lessonTimes": ["9:00", "9:30", "10:00", "10:30", "11:00"]
            }],
            "Headers": [{
                  "setTitle": "Sample Set"
                }, {
                  "setTitle": "New Set"
            }],
            "InstructorPreferences": [
                {
                    "headerId": 1,
                    "instructorId": 1,
                    "lessons": [
                        "Starfish",
                        "Duck",
                        "Sea Turtle",
                        "Sea Otter",
                        "Salamander",
                        "Sunfish",
                        "Crocodile",
                        "Whale"
                    ]
                },
                {
                    "headerId": 1,
                    "instructorId": 2,
                    "lessons": [
                        "Level 1",
                        "Level 2",
                        "Level 3",
                        "Level 4",
                        "Level 5",
                        "Level 6",
                        "Level 7",
                        "Level 8",
                        "Level 9",
                        "Level 10"
                    ]
                },
                {
                    "headerId": 1,
                    "instructorId": 3,
                    "lessons": [
                        "Basics I",
                        "Basics II",
                        "Strokes"
                    ]
                }
            ],
            "Instructors": [
                {
                    "headerId": 1,
                    "instructor": "Alfa",
                    "dateOfHire": "2011-02-01",
                    "privatesOnly": false,
                    "wsiExpiration": "2021-04-03"
                },
                {
                    "headerId": 1,
                    "instructor": "Beta",
                    "dateOfHire": "2012-06-05",
                    "privatesOnly": false,
                    "wsiExpiration": "2022-08-07"
                },
                {
                    "headerId": 1,
                    "instructor": "Charlie",
                    "dateOfHire": "2013-10-09",
                    "privatesOnly": false,
                    "wsiExpiration": "2023-12-11"
                }
            ],
            "Lessons": [
                {
                    "headerId": 1,
                    "quantity": 1,
                    "title": "Starfish"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Duck"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Sea Turtle"
                },
                {
                    "headerId": 1,
                    "quantity": 1,
                    "title": "Sea Otter"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Salamander"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Sunfish"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Crocodile"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Whale"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 1"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 2"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 3"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 4"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 5"
                },
                {
                    "headerId": 1,
                    "quantity": 1,
                    "title": "Level 6"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 7"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 8"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 9"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Level 10"
                },
                {
                    "headerId": 1,
                    "quantity": 1,
                    "title": "Basics I"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Basics II"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Strokes"
                },

                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Schoolboard"
                },
                {
                    "headerId": 1,
                    "quantity": 0,
                    "title": "Simple Set"
                }
            ],
            "Privates": [
                {
                    "headerId": 1,
                    "instructorId": 1,
                    "duration": 30,
                    "time": "9:00"
                },
                {
                    "headerId": 1,
                    "instructorId": 2,
                    "duration": 30,
                    "time": "9:30"
                },
                {
                    "headerId": 1,
                    "instructorId": 3,
                    "duration": 30,
                    "time": "10:00"
                }
            ]
        };
    }
}

module.exports = ComponentData;
