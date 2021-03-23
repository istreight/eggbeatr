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

    static _tickFade(element, duration, delay = 0, callback = () => null, last = Date.now()) {
        let delta, now = Date.now();
        if (duration <= 0 || last > now) return;

        delta = (now - last) / duration;

        // Don't allow opacity to be greater than 1.
        last = Date.now();
        element.style.opacity = Math.min(+element.style.opacity + delta, 1);

        if (+element.style.opacity < 1) {
            window.requestAnimationFrame(() => {
                this._tickFade(element, duration, delay, callback, last);
            });
        } else {
            window.setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, delay);
        }
    }

    /**
    * Custom function to smoothly fade a target element in.
     */
    static fadeIn(element, duration, delay, callback) {
        element.style.opacity = 0;

        this._tickFade(
            element,
            duration,
            delay,
            callback
        );
    }

    /**
     * Custom function to smoothly fade a target element out.
     */
    static fadeOut(element, duration, delay, callback) {
        element.style.opacity = 1;

        let last = Date.now();
        let tick = () => {
            let delta = (Date.now() - last) / duration;
            element.style.opacity = +element.style.opacity - delta;
            last = Date.now();

            if (+element.style.opacity > 0) {
                requestAnimationFrame(tick);
            } else {
                setTimeout(() => {
                    if (callback) {
                        callback();
                    }
                }, delay || 0);
            }
        };

        tick();
    }

    /**
     * Custom function to slide an object in a cardinal direction.
     */
    static slide(duration, display, callback) {
        let start = Date.now();
        let tick = () => {
            let progress;
            let timeFraction = Math.min((Date.now() - start) / duration, 1);

            // Accelerates until the half-way point, then decelerates.
            if (timeFraction < 0.5) {
                progress = Math.pow(2 * timeFraction, 2) / 2;
            } else {
                progress = (2 - Math.pow(2 * (1 - timeFraction), 2)) / 2;
            }

            display(progress);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else if (callback) {
                callback();
            }
        };

        tick();
    }
}

export default Animator;
