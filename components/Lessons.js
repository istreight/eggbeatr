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
        if (sessionStorage.getItem("lessons") && sessionStorage.getItem("lessons") !== "{}") {
            this.lessonSet = JSON.parse(sessionStorage.getItem("lessons"));

            for (var lessonQuantity in this.lessonSet) {
                if (this.lessonSet[lessonQuantity] > 0) {
                    this.numLessons += this.lessonSet[lessonQuantity];
                }
            }
        } else {
            this.lessonSet = {
                "Level 5": 1,
                "Level 6": 1
            };

            this.numLessons = 2;
        }

        this.props.callback(this.lessonSet, this.props.lipReader);

        this.setLessonValues();

        this.props.gridChecklist.checkComplete($("#lessons-checklist"), this.numLessons);

        // Make component size of window.
        $("#dynamicLessons").css({
            "height": ($(window).height() - 55) + "px"
        });

        // Save on button click or on input deselect ('blur').
        $("#save-lessons").click(this.storeLessonValues.bind(this));
        $("input").blur(this.storeLessonValues.bind(this));

        // Link tutorital button to next section.
        $("#lessons-next").click(function() {
            $("body").on("mousewheel DOMMouseScroll", function() {
                return false;
            });
            $("#private-footer").css({
                "display": "block"
            });
            $("html, body").animate({
                scrollTop: $("#dynamicPrivate").offset().top - 57
            }, 1600, function() {
                $("body").off("mousewheel DOMMouseScroll");
                $("#lessons-footer").css({
                    "display": "none"
                });
            });
        });
    }

    /*
     * Finds the value in the input field and stores it in lessonSet.
     */
    storeLessonValues() {
        this.numLessons = 0;

        // Disable "Save Lessons" button.
        $("#save-lessons").unbind("click");

        // Display notification.
        $("#save-notification").fadeIn(800).delay(800).fadeOut(800);

        // Store text field values.
        var that = this;
        $("#lessons-table tr td").each(function() {
            if ($($(this).children()[1]).is("input")) {
                var lessonType = $($(this).children()[0]).text();
                var lessonValue = $($(this).children()[1]).val();
                var lessonQuantity = parseInt(lessonValue);

                if (lessonValue === "") {
                    lessonQuantity = 0;
                }

                if (/^[0-9]$/.test(lessonQuantity)) {
                    if ($(this).hasClass("error-table")) {
                        $(this).hide().removeClass("error-table").fadeIn(800);
                    }

                    that.lessonSet[lessonType] = lessonQuantity;
                    that.numLessons += lessonQuantity;
                } else {
                    $(this).hide().addClass("error-table").fadeIn(800, () => {
                        // Re-enable "Save Lessons" button.
                        $("#save-lessons").click(that.storeLessonValues.bind(that));
                    });
                    that.lessonSet[lessonType] = 0;
                }
            }
        });

        if (this.numLessons === 0) {
            this.lessonSet = {
                "empty": -1
            }
        } else {
            delete this.lessonSet.empty;
        }

        this.props.gridChecklist.checkComplete($("#lessons-checklist"), this.numLessons);

        this.props.callback(this.lessonSet, this.props.lipReader);
    }

    setLessonValues() {
        var that = this;
        $("#lessons-table tr td").each(function() {
            if ($($(this).children()[1]).is("input")) {
                var lessonType = $($(this).children()[0]).text();
                var lessonInput = $($(this).children()[1]);

                if (that.lessonSet[lessonType] !== 0) {
                    lessonInput.val(that.lessonSet[lessonType]);
                }
            }
        });
    }

    render() {
        return (
                <div id="lessons-container">
                    <h2 className="content-head is-right">
                        Lessons
                    </h2>
                    <div className="content-section-description is-right right-text">
                        Describe the lessons of the set.
                        <ul className="content-section-explanation">
                            <li>Quantify each lesson type of the set</li>
                            <li>Use any numeric quantity</li>
                            <li>Cache the quantities only when you want</li>
                        </ul>
                        <a id="save-lessons" className="pure-button">
                            Save Lessons
                        </a>
                        <div id="save-notification">
                            Saved!
                        </div>
                    </div>
                    <table id="lessons-table" className="pure-table">
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
                    <div id="lessons-footer" className="content-section-footer">
                        <h2 className="content-head">
                            <font color="#2d3e50">Step #2:</font>
                        </h2>
                        <font color="#333">
                            Input the quantity of each lesson type, using numerical digits.
                        </font>
                        <a id="lessons-next" className="content-next-button pure-button">
                            &rarr;
                        </a>
                    </div>
                </div>
        );
    }
}

Lessons.propTypes =  {
    callback: React.PropTypes.func.isRequired,
    lipReader: React.PropTypes.object.isRequired,
    gridChecklist: React.PropTypes.object.isRequired
}

export default Lessons;
