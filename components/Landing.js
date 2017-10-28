/**
 * FILENAME:    Landing.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the Landing class for the landing page content of the
 * lesson calendar web application. The Landing class is exported.
 */

import React from 'react';
import Header from './Header';

class Landing extends React.Component {
    componentDidMount() {
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
            scrollTop: $("#dynamicInstructors").offset().top - 60
        }, 3200, function() {
            $("body").off("mousewheel DOMMouseScroll");
        });

        // Display only first tutorial message.
        $("#dynamicInstructors .ribbon-section-footer").css({
            "display": "block"
        });
        $("#lessons-footer").css({
            "display": "none"
        });
        $("#private-footer").css({
            "display": "none"
        });
        $("#dynamicGrid .content-section-footer").css({
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
                    doing the heavy lifting while leaving you with creative control
                </p>
                <a id="get-started" className="pure-button pure-button-primary">
                    Get Started
                </a>
            </div>
        );
    }
}

export default Landing;
