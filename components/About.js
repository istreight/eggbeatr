/**
 * FILENAME:    About.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the About class, displaying a description of the lesson
 * calendar web application. The About class is exported.
 */

import React from 'react';

class About extends React.Component {
    render() {
        return (
            <div>
                <h2 className="content-head is-center">
                    About
                </h2>
                <div className="content-section-description">
                    eggbeatr
                    <div className="content-section-explanation">
                        an application designed to build a calendar of swim lessons using customizable sets of instructors and lessons.
                    </div>
                </div>
                <ul>
                    <li>
                        <img src="./img/settings-icon.png" />
                        <p className="feature-description">
                            Our algorithm pairs your instructors with your lessons just like you would.
                        </p>
                    </li>
                    <li>
                        <img src="./img/person-icon.png" />
                        <p className="feature-description">
                            Schedule private lessons at a specific time and we&#039;ll make sure nothing conflicts.
                        </p>
                    </li>
                    <li>
                        <img src="./img/timer-icon.png" />
                        <p className="feature-description">
                            eggbeatr makes the most of your instructors by using their time between lessons.
                        </p>
                    </li>
                    <li>
                        <img src="./img/stats-icon.png" />
                        <p className="feature-description">
                            We&#039;ll do the monotonous work so you can spend more time on what you enjoy.
                        </p>
                    </li>
                </ul>
            </div>
        );
    }
}

export default About;
