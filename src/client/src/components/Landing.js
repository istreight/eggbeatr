/**
 * FILENAME:    Landing.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the Landing class for the landing
 *  page content of the lesson calendar web application.
 * The Landing class is exported.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Anchor from 'utils/Anchor';
import Animator from 'functions/Animator';
import FnScroll from 'functions/FnScroll';

class Landing extends React.Component {
    componentDidMount() {
        var name = $("#dynamicLanding h1 div");
        var getStarted = $("#dynamicLanding a");

        getStarted.hide();

        // Fade in 'WELCOME', then cycle through 3 name styles.
        name.hide().fadeIn(2000).delay(3000).fadeOut(1500, () => {
            name.html("eggbeatr");

            getStarted.delay(800).fadeIn(1500);
            getStarted.click(this.getStarted);

            this.cycle(1);
        });
    }

    /**
     * Starts a tutorial on how to run application.
     */
    getStarted() {
        // Disable scrolling.
        $("body").on("mousewheel DOMMouseScroll", false);

        $("html, body").animate({
            scrollTop: $("#dynamicInstructors").offset().top - 60
        }, 3200, () => {
            $("body").off("mousewheel DOMMouseScroll");
        });

        $("#dynamicInstructors .ribbon-section-footer").css({
            "display": "block"
        });

        $("#dynamicLessons .content-section-footer").css({
            "display": "none"
        });

        $("#dynamicPrivate .ribbon-section-footer").css({
            "display": "none"
        });

        $("#dynamicGrid .content-section-footer").css({
            "display": "none"
        });

        $("#grid-table .pure-menu-list").empty();
    }

    /**
     * Rotates through 3 styles of the application name,
     *  fading in and out.
     */
    cycle(stage) {
        var style = "";
        var weight = "";
        var name = $("#dynamicLanding h1 div");

        if (stage === 1) {
            style = "italic";
        } else if (stage === 2) {
            weight = "bold";
        }

        name.fadeIn(800).delay(2000).fadeOut(600, () => {
            name.css("font-style", style);
            name.css("font-weight", weight);

            this.cycle(++stage % 3);
        });
    }

    render() {
        return (
            <div className="splash">
                <h1 className="splash-head lowercase">
                    <div>
                        welcome
                    </div>
                </h1>
                <p className="splash-subhead">
                    a calendar application for organizing swim lessons<br />
                    doing the heavy lifting while leaving you with creative control
                </p>
                <a className="pure-button pure-button-primary">
                    Get Started
                </a>
            </div>
        );
    }
}

export default Landing;
