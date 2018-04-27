/**
 * FILENAME:    Lessons.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 2nd, 2016
 *
 * This file contains the Intructors class for the collection of instructors for
 * the lesson calendar web application. The Instructors class is exported.
 */

import React from 'react';

class Lessons extends React.Component {
    constructor(props) {
        super(props);

        // Object containing number of each lesson type.
        this.lessonSet = {};
        this.numLessons = 0;
    }

    componentDidMount() {
        this.props.connector.getLessonData().then(res => this.init(res));

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
     * Store the lessons data locally, as returned from the
     *  asynchronous call.
     */
    init(lessonData) {
        this.lessonSet = lessonData;

        this.setLessonValues();
        this.numLessons = this.getNumLessons();

        this.props.callback(this.lessonSet, this.props.controller, false);
        this.props.gridChecklist.setQuantity("lessons", this.numLessons);
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

            var lessonQuantity = this.lessonSet[lesson];

            if (lessonQuantity > 0) {
                numLessons += lessonQuantity;
            }
        }

        return numLessons;
    }

    /**
     * Finds the value in the input field and stores it in lessonSet.
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

                if (isNaN(lessonQuantity)) {
                    lessonQuantity = 0;
                }

                if (reSingleDigit.test(lessonQuantity)) {
                    if ($(element).hasClass("error-cell")) {
                        $(element).hide().removeClass("error-cell").fadeIn(800);
                    }

                    this.lessonSet[lessonType] = lessonQuantity;
                } else {
                    $(element).hide().addClass("error-cell").fadeIn(800);

                    this.lessonSet[lessonType] = 0;
                }
            }
        });

        // Re-enable "Save Lessons" button.
        $("#dynamicLessons .content-section-description a").click(this.storeLessonValues.bind(this));

        this.numLessons = this.getNumLessons();

        if (this.numLessons === 0) {
            this.lessonSet = {
                "empty": -1
            }
        } else {
            delete this.lessonSet.empty;
        }

        this.props.callback(this.lessonSet, this.props.controller, true);
        this.props.gridChecklist.setQuantity("lessons", this.numLessons);
    }

    /**
     * Place the values in the Lessons object as values in the related inputs.
     */
    setLessonValues() {
        $("#dynamicLessons td").each((index, element) => {
            var lessonInput = $(element).find("input");

            if (lessonInput.length > 0) {
                var lessonType = $(element).find("span").text();
                var lessonQuantity = this.lessonSet[lessonType];

                if (lessonQuantity > 0) {
                    lessonInput.val(lessonQuantity);
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
                                <td></td>
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
                                <td></td>
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
    callback: React.PropTypes.func.isRequired,
    connector: React.PropTypes.object.isRequired,
    controller: React.PropTypes.object.isRequired,
    gridChecklist: React.PropTypes.object.isRequired
}

export default Lessons;
