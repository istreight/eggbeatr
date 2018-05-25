/**
 * FILENAME:    Lessons.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 2nd, 2016
 *
 * This file contains the Intructors class for the
 *  collection of instructors for the web application.
 * The Instructors class is exported.
 */

import React from 'react';
import PropTypes from 'prop-types';


class Lessons extends React.Component {
    constructor(props) {
        super(props);

        // Object containing number of each lesson type.
        this.lessonSet = {};
    }

    componentDidMount() {
        this.lessonSet = this.props.initData;

        this.setLessonValues();

        this.props.callback(this.lessonSet, "lessons", false);
        this.props.setChecklistQuantity("lessons", this.getNumLessons());

        // Save on button click or on input deselect ('blur').
        $("#dynamicLessons .content-section-description a").click(this.storeLessonValues.bind(this));
        $("#dynamicLessons input").blur(this.storeLessonValues.bind(this));

        // Link tutorital button to next section.
        $("#dynamicLessons .content-section-footer a").click(() => {
            // Disable scrolling.
            $("body").on("mousewheel DOMMouseScroll", false);

            $("#dynamicPrivate .ribbon-section-footer").css({
                "display": "block"
            });

            $("html, body").animate({
                scrollTop: $("#dynamicPrivate").offset().top - 60
            }, 1600, () => {
                $("body").off("mousewheel DOMMouseScroll");

                $("#dynamicLessons .content-section-footer").css({
                    "display": "none"
                });
            });
        });
    }

    /**
     * Get number of stored lessons.
     */
    getNumLessons() {
        var numLessons = 0;

        for (var lesson in this.lessonSet) {
            if (lesson === "half" || lesson === "threequarter") {
                continue;
            }

            numLessons += this.lessonSet[lesson].quantity;;
        }

        return numLessons;
    }

    /**
     * Finds values in the input field to store in lessonSet.
     */
    storeLessonValues() {
        // Disable 'Save Lessons' button.
        $("#dynamicLessons .content-section-description a").unbind("click");

        // Display 'Saved!' notification.
        $("#dynamicLessons .content-section-description div").fadeIn(800).delay(800).fadeOut(800);

        // Store text field values.
        $("#dynamicLessons td").each((index, element) => {
            var lessonInput = $(element).find("input");
            var lessonType = $(element).find("span").text();

            if (lessonInput.length > 0 && lessonType.length > 0) {
                var lessonValue = lessonInput.val();
                var reSingleDigit = new RegExp(/^[0-9]$/);
                var lessonQuantity = parseInt(lessonValue, 10);

                if (lessonValue === "") {
                    lessonQuantity = 0;
                }

                if (reSingleDigit.test(lessonQuantity)) {
                    $(element).removeClass("error-cell");
                    if (this.lessonSet[lessonType]) {
                        this.lessonSet[lessonType].quantity = lessonQuantity;
                    } else {
                        this.lessonSet[lessonType] = {
                            "quantity": lessonQuantity
                        };
                    }
                } else {
                    $(element).hide().addClass("error-cell").fadeIn(800);

                    this.lessonSet[lessonType].quantity = 0;
                }
            }
        });

        // Re-enable "Save Lessons" button.
        $("#dynamicLessons .content-section-description a").click(this.storeLessonValues.bind(this));

        var missingId = Object.keys(this.lessonSet).filter((value, index) => this.lessonSet[value].id === undefined);

        // Ignore half and threequarter lesson quantities.
        if (missingId.length > 2) {
            var promise;
            var promiseArray = [];

            for (var i = 0; i < missingId.length; i++) {
                var lessonTitle = missingId[i];
                var body = {
                    quantity: 0,
                    title: lessonTitle,
                },

                promise = this.props.createComponent(body, "Lesson");

                promiseArray.push(promise);
            }

            Promise.all(promiseArray).then((res) => {
                for (var i = 0; i < res.length; i++) {
                    var data = res[i];
                    var lessonTitle = Object.keys(data)[0];
                    this.lessonSet[lessonTitle] = data[lessonTitle];
                }
            }).catch(error => console.error(error));
        } else {
            this.props.callback(this.lessonSet, "lessons", true);
            this.props.setChecklistQuantity("lessons", this.getNumLessons());
        }

    }

    /**
     * Place the values in the Lessons object as values
     *  in the related inputs.
     */
    setLessonValues() {
        $("#dynamicLessons td").each((index, element) => {
            var lessonInput = $(element).find("input");

            if (lessonInput.length > 0) {
                var lessonQuantity;
                var lessonType = $(element).find("span").text();
                var lesson = this.lessonSet[lessonType];

                if (lesson === undefined) {
                    lessonQuantity = 0;
                } else {
                    lessonQuantity = lesson.quantity;
                }

                if (lessonQuantity > 0) {
                    lessonInput.val(lessonQuantity);
                } else {
                    lessonInput.val("");
                }
            }
        });
    }

    render() {
        return (
                <div>
                    <h2 className="content-head is-right">
                        Lessons
                    </h2>
                    <div className="content-section-description is-right float-right">
                        Describe the lessons of the set.
                        <ul className="content-section-explanation">
                            <li>Quantify each lesson type of the set</li>
                            <li>Use any numeric quantity</li>
                            <li>Automatically store lesson quantities</li>
                        </ul>
                        <a className="pure-button right-button">
                            Save Lessons
                        </a>
                        <div>
                            Saved!
                        </div>
                    </div>
                    <table className="pure-table">
                        <thead>
                            <tr>
                                <th>
                                    Parent & Tot
                                </th>
                                <th>
                                    Pre-School
                                </th>
                                <th>
                                    Swim Kids
                                </th>
                                <th>
                                    Swim Kids
                                </th>
                                <th>
                                    Teens & Adults
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-odd">
                                <td>
                                    Starfish
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Sea Otter
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 1
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 6
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Basics I
                                    <input type="text" placeholder="#" />
                                </td>
                            </tr>
                            <tr className="table-even">
                                <td>
                                    Duck
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Salamander
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 2
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 7
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Basics II
                                    <input type="text" placeholder="#" />
                                </td>
                            </tr>
                            <tr className="table-odd">
                                <td>
                                    Sea Turtle
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Sunfish
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 3
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 8
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Strokes
                                    <input type="text" placeholder="#" />
                                </td>
                            </tr>
                            <tr className="table-even">
                                <td></td>
                                <td>
                                    Crocodile
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 4
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 9
                                    <input type="text" placeholder="#" />
                                </td>
                                <td></td>
                            </tr>
                            <tr className="table-odd">
                                <td>
                                    Simple Set
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Whale
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 5
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Level 10
                                    <input type="text" placeholder="#" />
                                </td>
                                <td>
                                    Schoolboard
                                    <input type="text" placeholder="#" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="content-section-footer">
                        <h2 className="content-head">
                            Step #2:
                        </h2>
                        <p>
                            Input the quantity of each lesson type, using numerical digits.
                        </p>
                        <a className="content-next-button pure-button">
                            &rarr;
                        </a>
                    </div>
                </div>
        );
    }
}

Lessons.propTypes =  {
    callback: PropTypes.func.isRequired,
    initData: PropTypes.object.isRequired,
    connector: PropTypes.object.isRequired,
    setChecklistQuantity: PropTypes.func.isRequired
}

export default Lessons;
