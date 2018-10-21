/**
 * FILENAME:    Landing.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 19th, 2016
 *
 * This file contains the Landing class for the landing
 *  page content of the lesson calendar web application.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Anchor from 'utils/Anchor';
import Animator from 'functions/Animator';
import FnScroll from 'functions/FnScroll';

class Landing extends React.Component {
    componentDidMount() {
        var node = ReactDOM.findDOMNode(this);
        var title = node.querySelector("div h1 div");
        var getStartedButton = node.querySelector("a");

        // Fade in WELCOME, then cycle through title styles.
        Animator.fadeIn(title, 1200, 400, () => {
            Animator.fadeOut(title, 800, 0, () => {
                title.innerHTML = "eggbeatr";
                Animator.fadeIn(getStartedButton, 1500);

                this.cycle(1, title);
            });
        });
    }

    /**
     * Rotates through 3 styles of the application title,
     *  fading in and out.
     */
    cycle(stage, title) {
        var style = "";
        var weight = "";

        if (stage === 1) {
            style = "italic";
        } else if (stage === 2) {
            weight = "bold";
        }

        Animator.fadeIn(title, 1200, 400, () => {
            Animator.fadeOut(title, 800, 0, () => {
                title.style.fontStyle = style;
                title.style.fontWeight = weight;

                this.cycle(++stage % 3, title);
            });
        });
    }

    /**
     * Starts a tutorial on how to run application.
     */
    getStarted() {
        var range = document.createRange();
        var nextLocation = document.getElementById("dynamicInstructors");

        FnScroll.tutorialScroll(null, nextLocation);
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
                <div>
                    <Anchor
                        callback={ () => null }
                        data={ "Get Started" }
                        handleClick={ this.getStarted }
                        hyperlink={ "javascript:void(0)" }
                        styleClass={ "pure-button pure-button-primary" }
                    />
                </div>
            </div>
        );
    }
}

export default Landing;
