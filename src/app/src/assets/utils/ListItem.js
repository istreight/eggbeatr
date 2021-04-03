/**
 * FILENAME:    ListItem.js
 * AUTHOR:      Isaac Streight
 * START DATE:  May 31th, 2018
 *
 * This file contains the ListItem class, a utility class for list item tags
 *  in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';


class ListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props
        };
    }

    /**
     * Return a new set of props.
     * @param  {Object} nextProps An object describing the next state of an Anchor instance.
     * @param  {Object} nextProps An object describing the previous state of an Anchor instance.
     * @return {Object}           The new state of an Anchor instance.
     */
    static getDerivedStateFromProps(nextProps) {
        return nextProps;
    }

    render() {
        return (
            <li className={ this.state.styleClass }>
                { this.state.data }
            </li>
        );
    }
}

ListItem.propTypes = {
    data: PropTypes.array.isRequired,
    styleClass: PropTypes.string.isRequired
}

export default ListItem;
