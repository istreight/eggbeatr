/**
 * FILENAME:    UnorderedList.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the UnorderedList class, a utility class for
 *  unordered list tags in the application.
 *
 * @format
 */
import React from "react";
import PropTypes from "prop-types";
import ListItem from "utils/ListItem";
class UnorderedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props
        };
    }
    componentDidMount() {
        this.props.callback(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.updateProps) {
            return nextProps;
        } else {
            return prevState;
        }
    }
    getListItems() {
        var listData = this.state.data;
        return listData.map((itemData, index) => React.createElement(
            ListItem, {
                data: itemData.data
                , key: "key-listitem-" + index
                , styleClass: itemData.styleClass
            }));
    }
    render() {
        return <ul className = {
            this.state.styleClass
        } > {
            this.getListItems()
        } < /ul>;
    }
}
UnorderedList.defaultProps = {
    callback: () => null
    , styleClass: "pure-menu-list"
    , updateProps: true
};
UnorderedList.propTypes = {
    callback: PropTypes.func
    , data: PropTypes.array.isRequired
    , styleClass: PropTypes.string
    , updateProps: PropTypes.bool
};
export default UnorderedList;