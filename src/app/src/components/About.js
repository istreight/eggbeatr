/**
 * FILENAME:    About.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the About class, displaying a description of the lesson
 *  calendar web application.
 */

import React from 'react';

import UnorderedList from '@utils/UnorderedList';
import FeatureDescription from '@specializations/FeatureDescription';


class About extends React.Component {
    constructor(props) {
        super(props);
    }

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
                <UnorderedList
                    data={ [
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": "assets/img/person-icon.png",
                                    "key": "key-featuredescription-0",
                                    "textDesc": "Schedule private lessons at a specific time and we'll make sure nothing conflicts."
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": "assets/img/settings-icon.png",
                                    "key": "key-featuredescription-0",
                                    "textDesc": "Our algorithm pairs your instructors with your lessons just like you would."
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": "assets/img/stats-icon.png",
                                    "key": "key-featuredescription-0",
                                    "textDesc": "We'll do the monotonous work so you can spend more time on what you enjoy."
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": "assets/img/timer-icon.png",
                                    "key": "key-featuredescription-0",
                                    "textDesc": "eggbeatr makes the most of your instructors by using their time between lessons."
                                })
                            ],
                            "styleClass": ""
                        }
                    ] }
                    styleClass={ "" }
                />
            </div>
        );
    }
}

export default About;
