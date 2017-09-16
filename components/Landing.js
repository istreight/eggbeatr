/**
 * FILENAME:    Landing.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the Landing class for the landing page content of the
 * lesson calendar web application. The Landing class is exported.
 *
 *
 * CHANGE LOG:
 *  19/10/16:
 *              Transfered code from index.html, written by PureCSS, Yahoo! Inc.
 *              Placed temporary name and added description of application.
 *
 *  20/10/16:
 *              Added the componentDidMount, cycle functions and the div tag
 *              nested in the 'splash' h1 tag. The goal of this pair of
 *              functions is to cycle through CSS stylings of the name of the
 *              application.
 *              NOTE: the name of the application is undecided.
 *
 *  21/10/16:
 *              Added "Welcome" on page load. Cycle now starts at 0,
 *              with the related "name-0" div tag.
 *              Changed cycle() timeout to 3410.
 *                  (IF FADE THEN CHANGE, DECREASE; IF CHANGE THEN FADE, INCREASE)
 *              Added fade in (timed halfway through delay of application name)
 *              and onclick event for "Get Started" anchor.
 *
 *  23/10/16:
 *              Changed cycle() timeout to 3415 [WAS: div-tag change then fade].
 *              Changed cycle() timeout to 3414.
 *
 *  26/10/16:
 *              Changed bind("click", function() {}) to click().
 */

import React from 'react';
import Header from './Header';

class Landing extends React.Component {
    componentDidMount() {
        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("clearStorage") === "session") {
            sessionStorage.clear();
        }

        // Fade in 'WELCOME', then cycle through 3 name styles.
        $("#get-started").hide();
        $("#name").addClass("lowercase");
        $("#name").hide().fadeIn(2000).delay(3000).fadeOut(1500, function() {
            $("#get-started").delay(800).fadeIn(1500);
            $("#get-started").click(this.getStarted);
            this.cycle(1);
        }.bind(this));
    }

    /*
     * Starts a tutorial on how to run application.
     * Crosses through multiple components.
     */
    getStarted() {
        // Scroll down to 'dynamicInstructors'.
        $("body").on("mousewheel DOMMouseScroll", function() {
            return false;
        });
        $("html, body").animate({
            scrollTop: $("#dynamicInstructors").offset().top - 57
        }, 3200, function() {
            $("body").off("mousewheel DOMMouseScroll");
        });

        // Display only first tutorial message.
        $("#instructor-footer").css({
            "display": "block"
        });
        $("#lessons-footer").css({
            "display": "none"
        });
        $("#private-footer").css({
            "display": "none"
        });
        $("#grid-footer").css({
            "display": "none"
        });

        $("#grid-table .pure-menu-list").empty();
    }

    /*
     * Rotates through 3 styles of the name of the application, fading in and out.
     * Alters CSS by changing div tag name.
     */
    cycle(stage) {
        if ($("#name").html() !== "eggbeatr") {
            $("#name").empty();
            $("#name").append("eggbeatr");
        }

        $("#name").fadeIn(800).delay(2000).fadeOut(600, () => {
            this.changeCycleStyle(stage);
            this.cycle(++stage % 3);
        });
    }

    changeCycleStyle(stage) {
        var style = stage === 1 ? "italic" : "";
        var weight = stage === 2 ? "bold" : "";

        $("#name").css("font-style", style);
        $("#name").css("font-weight", weight);
    }

    render() {
        return (
            <div className="splash">
                <h1 className="splash-head">
                    <div id="name">
                        welcome
                    </div>
                </h1>
                <p className="splash-subhead">
                    a calendar application for organizing swim lessons<br />
                    that the heavy lifting while leaving you with creative control
                </p>
                <a id="get-started" className="pure-button pure-button-primary">
                    Get Started
                </a>
            </div>
        );
    }
}

export default Landing;
