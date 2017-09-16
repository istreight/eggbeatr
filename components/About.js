/**
 * FILENAME:    About.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the About class, displaying a description of the lesson
 * calendar web application. The About class is exported.
 *
 * Icons from
 *  iconarchive.com/show/flat-finance-icons-by-graphicloads.html
 *  iconarchive.com/show/100-flat-icons-by-graphicloads.html
 *
 *
 * CHANGE LOG:
 *  11/11/16:
 *              Added description about web application.
 *              Added images & descriptions for features.
 *
 *              ALTERNATE: "<i>(informal)</i> an incomplete kitchen utensil".
 *
 *  12/11/16:
 *              Added dynamic sizing so component takes up window.
 */

import React from 'react';

class About extends React.Component {
    componentDidMount() {
        // Make component size of window.
        $("#dynamicAbout").css({
            "height": ($(window).height() - 55) + "px"
        });
    }

    render() {
        return (
            <div id="about-container">
                <h2 className="content-head is-center">
                    About
                </h2>
                <div id="about-definition-container" className="content-section-description">
                    eggbeatr
                    <div id="about-explanation-container">
                        an application designed to build a calendar of swim lessons using customizable sets of instructors and lessons.
                    </div>
                </div>
                <div id="features">
                    <div>
                        <img src="./img/settings-icon.png" />
                        <p className="feature-description">
                            Our algorithm pairs your instructors with your lessons just like you would.
                        </p>
                    </div>
                    <div>
                        <img src="./img/person-icon.png" />
                        <p className="feature-description">
                            Schedule private lessons at a specific time and we&#039;ll make sure nothing conflicts.
                        </p>
                    </div>
                    <div>
                        <img src="./img/timer-icon.png" />
                        <p className="feature-description">
                            eggbeatr makes the most of your instructors by using their time between lessons.
                        </p>
                    </div>
                    <div>
                        <img src="./img/stats-icon.png" />
                        <p className="feature-description">
                            We&#039;ll do the monotonous work so you can spend more time on what you enjoy.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
