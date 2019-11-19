/**
 * FILENAME:    About.js
 * AUTHOR:      Isaac Streight
 * START DATE:  November 1st, 2016
 *
 * This file contains the About class, displaying a description of the lesson
 *  calendar web application.
 */

import React from 'react';

import UnorderedList from 'utils/UnorderedList';
import FeatureDescription from 'specializations/FeatureDescription';


class About extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
    }

    componentWillMount() {
        var person = {
            "imgSrc": "assets/img/person-icon.png",
            "textDesc": "Schedule private lessons at a specific time and we'll make sure nothing conflicts."
        };

        var settings = {
            "imgSrc": "assets/img/settings-icon.png",
            "textDesc": "Our algorithm pairs your instructors with your lessons just like you would."
        };

        var stats = {
            "imgSrc": "assets/img/stats-icon.png",
            "textDesc": "We'll do the monotonous work so you can spend more time on what you enjoy."
        };

        var timer = {
            "imgSrc": "assets/img/timer-icon.png",
            "textDesc": "eggbeatr makes the most of your instructors by using their time between lessons."
        };

        this.setState({
            "stats": stats,
            "timer": timer,
            "person": person,
            "settings": settings
        });
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
                                    "imgSrc": this.state.person.imgSrc,
                                    "key": "key-featuredescription-0",
                                    "textDesc": this.state.person.textDesc
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": this.state.settings.imgSrc,
                                    "key": "key-featuredescription-0",
                                    "textDesc": this.state.settings.textDesc
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": this.state.stats.imgSrc,
                                    "key": "key-featuredescription-0",
                                    "textDesc": this.state.stats.textDesc
                                })
                            ],
                            "styleClass": ""
                        },
                        {
                            "data": [
                                React.createElement(FeatureDescription, {
                                    "imgSrc": this.state.timer.imgSrc,
                                    "key": "key-featuredescription-0",
                                    "textDesc": this.state.timer.textDesc
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
