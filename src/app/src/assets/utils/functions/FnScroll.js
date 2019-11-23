/**
 * FILENAME:    FnScroll.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the FnScroll class, a utility class for
 *  auto-scrolling in the application.
 *
 * @format
 */
import React from "react";
import Animator from "functions/Animator";
class FnScroll extends React.Component {
    constructor(props) {
        super(props);
    }
    static scroll(next) {
        let initial = +window.pageYOffset;
        let deltaView = next.getBoundingClientRect();
        window.onwheel = (e) => {
            e.preventDefault();
        };
        Animator.slide(2000, (progress) => {
            window.scrollTo(0, initial + progress * (deltaView.top -
                58));
        }, () => {
            window.onwheel = null;
        });
    }
    /**
     * Modification of the scroll function for Tutorial related buttons.
     */
    static tutorialScroll(current, next) {
        let initial = +window.pageYOffset;
        let deltaView = next.getBoundingClientRect();
        let nextFoot = next.querySelector("[class*='section-footer']");
        nextFoot.classList.remove("hide");
        window.onwheel = (e) => e.preventDefault();
        Animator.slide(2000, (progress) => {
            window.scrollTo(0, initial + progress * (deltaView.top -
                58));
        }, () => {
            window.onwheel = null;
            if (current) {
                current.classList.add("hide");
            }
        });
    }
}
export default FnScroll;