/**
 * FILENAME:    SetList.js
 * AUTHOR:      Isaac Streight
 * START DATE:  July 8th, 2018
 *
 * This file contains the SetList class, a specialization class for
 *  the list of anchors in the header.
 */

import React from 'react';
import PropTypes from 'prop-types';

import UnorderedList from '@utils/UnorderedList';
import SetAnchor from '@specializations/SetAnchor';


class SetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    componentDidMount() {
        this.props.callback(this);
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
                    "data": setTitle,
                    "handleClick": () => this.handleClick(setTitle),
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
                data={ this.setListData() }
            />
        );
    }
}

SetList.defaultProps = {
    callback: () => null,
    data: {},
    handleClick: () => null,
    mode: "default",
    styleClass: "pure-menu-list"
}

SetList.propTypes = {
    callback: PropTypes.func,
    data: PropTypes.object,
    handleClick: PropTypes.func,
    mode: PropTypes.string,
    styleClass: PropTypes.string,
    width: PropTypes.string
}

export default SetList;
