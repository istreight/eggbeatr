/**
 * FILENAME:    Header.js
 * AUTHOR:      Isaac Streight
 * START DATE:  October 18th, 2016
 *
 * This file contains the Header class for the header
 *  content of the lesson calendar web application.
 * The Header class is exported.
 */

import React from 'react';

class Header extends React.Component {
    componentDidMount() {
        // Scrolling header buttons.
        $("#dynamicHeader .pure-menu-link").click(this.scrollToDiv);
        $("#dynamicHeader .pure-menu-heading").click(this.scrollToDiv);
    }

    /**
     * Scrolls page to div tag based on contents of clicked item.
     */
    scrollToDiv() {
        var locationSelector = "#dynamic" + $(event.target).html();

        if (locationSelector.includes("eggbeatr")) {
            locationSelector = "#dynamicHeader";
        }

        // Disable scrolling.
        $("body").on("mousewheel DOMMouseScroll", false);

        // Auto-scroll to desired section.
        $("html, body").animate({
            scrollTop: $(locationSelector).offset().top - 60
        }, 2000, () => {
            $("body").off("mousewheel DOMMouseScroll");
        });
    }

    render() {
        return (
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">
                    eggbeatr &mdash; BETA
                </a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item">
                        <a className="pure-menu-link">
                            About
                        </a>
                    </li>
                    <li className="pure-menu-item">
                        <a className="pure-menu-link">
                            Instructors
                        </a>
                    </li>
                    <li className="pure-menu-item">
                        <a className="pure-menu-link">
                            Lessons
                        </a>
                    </li>
                    <li className="pure-menu-item">
                        <a className="pure-menu-link">
                            Private
                        </a>
                    </li>
                    <li className="pure-menu-item">
                        <a className="pure-menu-link">
                            Grid
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;
