/**
 * FILENAME:    Animator.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 6th, 2018
 *
 * This file contains the Animator class, a utility class for
 *  animating DOM elements.
 */

import React from 'react';


class Animator extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Either increase or decrease, change the opacity of an HTML element.
     * @param  {String} fadeDirection   Indicator of whether to increment or decrement the opacity of the element.
     * @param  {HTMLElement} element    The HTML element with which to apply the change in opacity.
     * @param  {Number} duration        Measure of how long the fade should take.
     * @param  {Number} delay           Measure of how long to wait until the callback is called. Defaults to 0.
     * @param  {Function} callback      Function to call after the duration has elapsed (and after a delay). Defaults to `() => null`.
     * @param  {Number} last            The time since the last update in the opacity of the element. Defaults to `Date.now()`.
     * @return {undefined}              There is no value returned.
     */
    static _tickFade(fadeDirection, element, duration, delay = 0, callback = () => null, last = Date.now()) {
        let reqFrame, opacity, delta, now = Date.now();

        if (duration <= 0 || last > now) return;
        if (!['In', 'Out'].includes(fadeDirection)) return;

        delta = (now - last) / duration;

        last = Date.now();
        opacity = parseFloat(element.style.opacity);

        if (fadeDirection === 'In') {
            opacity = Math.min(opacity + delta, 1);
            reqFrame = opacity < 1;
        } else if (fadeDirection === 'Out') {
            opacity = Math.max(opacity - delta, 0);
            reqFrame = opacity > 0;
        }

        // Don't allow opacity to be greater than 1.
        element.style.opacity = opacity;

        if (reqFrame) {
            window.requestAnimationFrame(() => this._tickFade(
                fadeDirection, element, duration, delay, callback, last
            ));
        } else {
            window.setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, delay);
        }
    }

    /**
     * Generate the values for smooth scrolling (horizontal or vertical) acuated via callback.
     * @param  {Number} duration        Measure of how long to scroll.
     * @param  {Function} displace      Function to translate the change of time into change of displacement on screen.
     * @param  {Function} callback      Function to call after the duration has elapsed. Defaults to `() => null`.
     * @param  {Number} start           The time since the start of calculations. Defaults to `Date.now()`.
     * @return {undefined}              There is no value returned.
     */
    static _tickSlide(duration, displace, callback = () => null, start = Date.now()) {
        let now = Date.now();
        let progress, timeFraction;

        if (duration <= 0 || (start > now)) return;
        if (!(displace instanceof Function)) return;

        // Accelerates until the half-way point, then decelerates.
        timeFraction = Math.min((now - start) / duration, 1);
        if (timeFraction < 0.5) {
            progress = Math.pow(2 * timeFraction, 2) / 2;
        } else {
            progress = (2 - Math.pow(2 * (1 - timeFraction), 2)) / 2;
        }

        displace(progress);

        if (progress < 1) {
            window.requestAnimationFrame(() => this._tickSlide(
                duration, displace, callback, start
            ));
        } else if (callback) {
            callback();
        }
    }

    /**
     * Reduces the opacity of an element to 0, then incrementally increases the opacity of the element throughout the duration.
     * @param  {HTMLElement} element    The HTML element with which to incrementally make visible.
     * @param  {Number} duration        Measure of how long the fade should take.
     * @param  {Number} delay           Measure of how long to wait until the callback is called.
     * @param  {Function} callback      Function to call after the duration has elapsed (and after a delay).
     * @return {undefined}              There is no value returned.
     */
    static fadeIn(element, duration, delay, callback) {
        element.style.opacity = 0;
        this._tickFade('In', element, duration, delay, callback);
    }

    /**
     * Boosts the opacity of an element to 1, then incrementally decreases the opacity of the element throughout the duration.
     * @param  {HTMLElement} element    The HTML element with which to incrementally make invisible.
     * @param  {Number} duration        Measure of how long the fade should take.
     * @param  {Number} delay           Measure of how long to wait until the callback is called.
     * @param  {Function} callback      Function to call after the duration has elapsed (and after a delay).
     * @return {undefined}              There is no value returned.
     */
    static fadeOut(element, duration, delay, callback) {
        element.style.opacity = 1;
        this._tickFade('Out', element, duration, delay, callback);
    }

    /**
     * Perform calculations to sample an inverse polynomial curve over short intervals (i.e., for smooth scrolling).
     * @param  {Number} duration        Measure of how long the slide should take.
     * @param  {Function} display       Function to translate the change of time into change of displacement on screen.
     * @param  {Function} callback      Function to call after the duration has elapsed.
     * @return {undefined}              There is no value returned.
     */
    static slide(duration, display, callback) {
        this._tickSlide(duration, display, callback);
    }

    /**
     * Smooth scroll from the current window view to a target DOM element.
     * @param  {HTMLElement} next       The DOM element to be in view after scrolling.
     * @return {undefined}              There is no value returned.
     */
    static scroll(next) {
        if (!next.nodeName) return;

        let initial = +window.pageYOffset;
        let deltaView = next.getBoundingClientRect();

        window.onwheel = (e) => e.preventDefault;

        Animator.slide(2000, (progress) => {
            window.scrollTo(0, initial + progress * (deltaView.top - 58));
        }, () => {
            window.onwheel = null;
        });
    }

    /**
     * Scroll from the current tutorial tool-tip to the next.
     * @param  {HTMLElement} current    The tutorial tool-tip currently in view.
     * @param  {HTMLElement} next       The tutorial tool-tip to be in view after scrolling.
     * @return {undefined}              There is no value returned.
     */
    static tutorialScroll(current, next) {
        if (!((current && current.nodeName) || (next && next.nodeName))) return;

        let initial = +window.pageYOffset;
        let deltaView = next.getBoundingClientRect();
        let nextFoot = next.querySelector("[class*='section-footer']");

        if (!nextFoot) return;

        nextFoot.classList.remove("hide");
        window.onwheel = (e) => e.preventDefault();

        Animator.slide(2000, (progress) => {
            window.scrollTo(0, initial + progress * (deltaView.top - 58));
        }, () => {
            window.onwheel = null;

            if (current) {
                current.classList.add("hide");
            }
        });
    }
}

export default Animator;
