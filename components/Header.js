/**
 * FILENAME:    Header.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the Header class for the header content of the
 * lesson calendar web application. The Header class is exported.
 */

import React from 'react';

class Header extends React.Component {
    componentDidMount() {
        // Bind header buttons.
        $("#dynamicHeader .pure-menu-heading").click(this.scrollToDiv);
        $("#dynamicHeader .pure-menu-link").click(this.scrollToDiv);
    }

    /**
     * Scrolls page to div tag based on div tag of clicked item.
     * The div tag of the clickable item should follow the id name pattern
     * "button-x", and will scroll the page to a div tag with the id of "x".
     */
    scrollToDiv(event) {
        // Disable scrolling.
        $("body").on("mousewheel DOMMouseScroll", false);

        // Auto-scroll to desired section.
        $("html, body").animate({
            scrollTop: $("#".concat(this.getAttribute("id").substring(7))).offset().top - 60
        }, 2000, function() {
            $("body").off("mousewheel DOMMouseScroll");
        });
    }

    render() {
        return (
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a id="button-dynamicHeader" className="pure-menu-heading">eggbeatr &ndash; BETA
                </a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a id="button-dynamicAbout" className="pure-menu-link">About</a></li>
                    <li className="pure-menu-item"><a id="button-dynamicInstructors" className="pure-menu-link">Instructors</a></li>
                    <li className="pure-menu-item"><a id="button-dynamicLessons" className="pure-menu-link">Lessons</a></li>
                    <li className="pure-menu-item"><a id="button-dynamicPrivate" className="pure-menu-link">Private</a></li>
                    <li className="pure-menu-item"><a id="button-dynamicGrid" className="pure-menu-link">Grid</a></li>
                </ul>
            </div>
        );
    }
}

export default Header;
