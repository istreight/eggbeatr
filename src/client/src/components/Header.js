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
    constructor(props) {
        super(props);

        this.header = {};
    }

    componentDidMount() {
        this.sortSets(this.props.initData);
        this.setTitles(false);

        this.props.callback(this.header, "header", false);

        // Scrolling header buttons.
        $("#dynamicHeader .pure-menu-link").click(this.scrollToDiv);
        $("#dynamicHeader .pure-menu-heading").click(this.scrollToDiv);
    }

    /**
     * Show the stored set names.
     */
    setTitles(isEditing) {
        var sets = this.header.sets;
        var editButton = $("#dynamicHeader .pure-button");
        var setList = $("#dynamicHeader .pure-menu-scrollable ul");
        var setTitle = $("#dynamicHeader .pure-menu-scrollable .pure-menu-heading");

        setList.empty();

        for (var setIndex = 0; setIndex < sets.length; setIndex++) {
            var set = sets[setIndex];
            var setName = set.setTitle;

            this.insertSet(setName);
        }

        if (isEditing) {
            this.editHeader();
        } else {
            this.finishEditingHeader();
        }
    }

    /**
     * Places the header in a state where the sets
     *  can be changed.
     */
    editHeader() {
        var editButton = $("#dynamicHeader .pure-button");
        var listItems = $("#dynamicHeader .pure-menu-scrollable .pure-menu-disabled");

        editButton.unbind("click");
        editButton.html("Finish Editing");
        editButton.click(this.finishEditingHeader.bind(this));

        listItems.unbind("click");
        listItems.addClass("removable-header");
        listItems.click(this.removeSet.bind(this));

        $("#dynamicHeader input").css("visibility", "visible");
        $("#dynamicHeader input").blur(this.addSet.bind(this));
        $("#dynamicHeader .pure-menu-scrollable ul").css("width", "24%");
    }

    /**
     * Places the header in a state where the sets
     *  cannot be changed.
     */
    finishEditingHeader() {
        var editButton = $("#dynamicHeader .pure-button");
        var listItems = $("#dynamicHeader .pure-menu-scrollable .pure-menu-disabled");

        editButton.html("Edit");
        editButton.unbind("click");
        editButton.click(this.editHeader.bind(this));

        listItems.unbind("click");
        listItems.removeClass("removable-header");
        listItems.click(this.selectSet.bind(this));

        $("#dynamicHeader input").css("visibility", "hidden");
        $("#dynamicHeader .pure-menu-scrollable ul").css("width", "28%");
    }

    /**
     * Store the selected set in the class object.
     */
    selectSet() {
        var set = $(event.target);
        var editButton = $("#dynamicHeader .pure-button");
        var setButtons = $("#dynamicHeader .pure-menu-scrollable .pure-menu-link");

        setButtons.addClass("pure-menu-disabled");
        set.removeClass("pure-menu-disabled");

        this.updateSet(set.html());
    }

    /**
     * Sets the selected set in each component.
     * If the set is not in component's object,
     *  add empty object.
     */
    updateSet(setTitle) {
        var headerSet;
        var headerTitle;
        var loadingIndicator = $("#dynamicHeader .create-indicator");

        for (var i = 0; i < this.header.sets.length; i++) {
            headerSet = this.header.sets[i];
            headerTitle = headerSet.setTitle;

            if (headerTitle === setTitle) {
                this.header.selectedSet = headerSet;

                break;
            }
        }

        $("#dynamicHeader .pure-menu-scrollable li a").each((index, element) => {
            if ($(element).html() !== this.header.selectedSet.setTitle) {
                $(element).addClass("pure-menu-disabled");
                $(element).removeClass("pure-menu-selected");
            } else {
                $(element).addClass("pure-menu-selected");
                $(element).removeClass("pure-menu-disabled");
            }
        });

        // Go to each component and set Set class variable.
        var time = Date.parse(new Date());
        loadingIndicator.css("visibility", "visible");
        this.props.callback(this.header, "header", true).then(() => {
            // Delay the loading indicator to improve readablility.
            setTimeout(
                () => loadingIndicator.css("visibility", "hidden"),
                Date.parse(new Date()) + 1000 - time
            );
        });
    }

    /**
     * Place a new set in the list.
     */
    insertSet(newSetName) {
        var newSetItem = $("<li class='pure-menu-item'></li>");
        var newSetButton = $("<a class='pure-menu-link'>" + newSetName + "</a>");

        if (newSetName !== this.header.selectedSet.setTitle) {
            newSetButton.addClass("pure-menu-disabled");
        }

        newSetButton.click(this.selectSet.bind(this));

        newSetItem.html(newSetButton);
        $("#dynamicHeader .pure-menu-scrollable ul").append(newSetItem);
    }

    /**
     * Add a new set to the list.
     */
    addSet() {
        if (this.header.sets.length > 10) {
            return;
        }

        var body;
        var listItems;
        var inputCell;
        var isIncluded;
        var newSetName;
        var inputField = $("#dynamicHeader input");
        var reSetName = new RegExp(/^[A-Za-z0-9]+$/);
        var addSetItem = $("#dynamicHeader .pure-menu-scrollable .pure-button").closest("li");

        inputCell = inputField.closest("a");
        newSetName = inputField.val();

        body = {
            "setTitle": newSetName
        }

        isIncluded = this.header.sets.find((header) => {
            return header.setTitle === newSetName;
        });

        if (isIncluded || !reSetName.test(newSetName)) {
            inputCell.hide().addClass("error-cell").fadeIn(800);

            return;
        }

        inputField.val("");
        inputCell.removeClass("error-cell");

        this.props.createComponent(body, "Header")
            .then((res) => {
                var scrollList = $('#dynamicHeader .pure-menu-scrollable ul');

                this.header.sets.push(res.selectedSet);

                this.insertSet(newSetName);

                scrollList.animate({
                    scrollLeft: scrollList.prop("scrollWidth")
                }, 1000);

                listItems = $("#dynamicHeader .pure-menu-scrollable .pure-menu-disabled");
                listItems.addClass("removable-header");
                listItems.unbind("click");
                listItems.click(this.removeSet.bind(this));
            });
    }

    /**
     * Remove a set.
     */
    removeSet() {
        var id;
        var headerSet;
        var headerTitle;
        var setTitle = $(event.target).html();

        for (var i = 0; i < this.header.sets.length; i++) {
            headerSet = this.header.sets[i];
            headerTitle = headerSet.setTitle;

            if (headerTitle === setTitle) {
                id = headerSet.id;

                break;
            }
        }

        this.props.removeComponent(id, "Header")
            .then(() => {
                var scrollList;

                this.header.sets.splice(i, 1);

                this.setTitles(true);

                if (i === this.header.sets.length - 1) {
                    scrollList = $("#dynamicHeader .pure-menu-scrollable ul");

                    scrollList.animate({
                        scrollLeft: scrollList.prop("scrollWidth") - i * 45
                    }, 1000);
                }
            });
    }

    /**
     * Sort the header set objects by setTitle.
     */
    sortSets(header) {
        var newSets = [];
        var newSelectedSet = {};

        Object.keys(header.sets).sort().forEach((key) => {
            newSets.push(header.sets[key]);
        });

        newSelectedSet = header.selectedSet;

        this.header = {
            "selectedSet": newSelectedSet,
            "sets": newSets
        }
    }

    /**
     * Scrolls page to div tag based on contents of clicked item.
     */
    scrollToDiv() {
        var locationSelector = "#dynamic" + $(event.target).html();

        if (locationSelector.includes("eggbeatr")) {
            locationSelector = "#dynamicHeader";
        }

        // Don't scroll on Set buttons.
        if ($(locationSelector).length === 0) {
            return;
        }

        // Disable scrolling.
        $("body").on("mousewheel DOMMouseScroll", false);

        // Auto-scroll to desired section.
        $("html, body").animate({
            scrollTop: $(locationSelector).offset().top - 58
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
                <a className="pure-menu-link pure-menu-heading">
                    SET
                </a>
                <a className="pure-menu pure-menu-horizontal pure-menu-scrollable">
                    <ul className="pure-menu-list"></ul>
                </a>
                <a className="header-input">
                    <input type="text" placeholder="..."></input>
                </a>
                <div className="create-indicator">
                    <div className="create-spinner">
                        <span></span><span></span>
                    </div>
                    <div className="create-label">Loading...</div>
                </div>
                <a className="pure-button">
                    Edit
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

Header.propTypes =  {
    callback: React.PropTypes.func.isRequired,
    initData: React.PropTypes.object.isRequired,
    createComponent: React.PropTypes.func.isRequired,
    removeComponent: React.PropTypes.func.isRequired
}

export default Header;
