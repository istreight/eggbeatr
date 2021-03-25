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
    * Custom function to smoothly fade a target element in.
     */
    static fadeIn(element, duration, delay, callback) {
        element.style.opacity = 0;
        this._tickFade('In', element, duration, delay, callback);
    }

    /**
     * Custom function to smoothly fade a target element out.
     */
    static fadeOut(element, duration, delay, callback) {
        element.style.opacity = 1;
        this._tickFade('Out', element, duration, delay, callback);
    }

    /**
     * Custom function to slide an object in a cardinal direction.
     */
    static slide(duration, display, callback) {
        this._tickSlide(duration, display, callback);
    }
}

export default Animator;
