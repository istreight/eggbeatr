/**
 * FILENAME:    UnorderedList.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the UnorderedList class, a utility class for
 *  unordered list tags in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ListItem from 'utils/ListItem';


class UnorderedList extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;
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

    getListItems() {
        var listData = this.state.data;

        return listData.map((itemData, index) =>
            React.createElement(ListItem, {
                "data": itemData.data,
                "key": "key-listitem-" + index,
                "styleClass": itemData.styleClass
            })
        );
    }

    render() {
        return (
            <ul className={ this.state.styleClass }>
                { this.getListItems() }
            </ul>
        );
    }
}

UnorderedList.propTypes = {
    callback: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    styleClass: PropTypes.string.isRequired
}

export default UnorderedList;
