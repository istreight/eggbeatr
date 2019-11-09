/**
 * FILENAME:    UnorderedList.js
 * AUTHOR:      Isaac Streight
 * START DATE:  July 8th, 2018
 *
 * This file contains the UnorderedList class, a utility class for
 *  unordered list tags in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import UnorderedList from 'utils/UnorderedList';
import SetAnchor from 'specializations/SetAnchor';

class SetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
        this.listData = null;
    }

    componentWillMount() {
        this.setState(this.props);
    }

    componentDidMount() {
        this.props.callback(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    handleClick(setTitle) {
        var isSelected = this.state.data.selectedSet.setTitle === setTitle;

        if (!isSelected) {
            this.state.handleClick(setTitle);
        }
    }

    setListData() {
        var result = [];
        var sets = this.state.data.sets;
        var selectedSet = this.state.data.selectedSet;

        if (sets) {
            sets.forEach((set, index) => {
                var setAnchor;
                var setTitle = set.setTitle;
                var styleClass = "pure-menu-link";
                var isSelected = setTitle === selectedSet.setTitle;

                if (!isSelected) {
                    styleClass += " pure-menu-disabled";

                    if (this.state.mode === "edit") {
                        styleClass += " removable-header";
                    }
                }

                setAnchor = React.createElement(SetAnchor, {
                    "callback": () => null,
                    "data": setTitle,
                    "handleClick": () => this.handleClick(setTitle),
                    "hyperlink": "#",
                    "key": "key-setlist-anchor-" + index,
                    "styleClass": styleClass
                });

                result.push({
                    "data": [setAnchor],
                    "styleClass": "pure-menu-item"
                })
            });
        }

        return result;
    }

    render() {
        return (
            <UnorderedList
                callback={ () => null }
                data={ this.setListData() }
                styleClass={ "pure-menu-list" }
            />
        );
    }
}

SetList.propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    styleClass: PropTypes.string.isRequired,
    width: PropTypes.string
}

export default SetList;
