/**
 * FILENAME:    ListItemSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 2nd, 2021
 *
 * This file contains the test specification for the ListItem utility class.
 */

import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';

import ListItem from '@utils/ListItem.js';


test.before(() => {});

test.beforeEach(() => {});

test.afterEach.always(() => {});

test.after.always(() => {});



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------       constructor        ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[ListItem constructor] is executed fully', async (t) => {
    let input = new ListItem({
        "key": "value"
    });
    let expected = {
        "state": {
            "key": "value"
        }
    };

    t.is(input.node, expected.node, 'ListItem node is not set as expected');
    t.deepEqual(input.state, expected.state, 'ListItem state is not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------    componentDidMount     ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[ListItem componentDidMount] is executed fully', async (t) => {
    let div = document.createElement('div');
    let expected = {
        "data": 'Garbage',
        "styleClass": "some-class",
    };

    t.log('State is made up of the props passed in');
    let listItem = ReactDOM.render(
        React.createElement(ListItem, expected),
        div
    );

    t.not(listItem.node, null, 'ListItem node is set unexpectedly');
    t.not(listItem.state.hyperlink, null, 'Unspecified prop is set unexpectedly');
    t.deepEqual(listItem.state, expected, 'ListItem state is not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------ getDerivedStateFromProps ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[ListItem getDerivedStateFromProps] is executed fully', async (t) => {
    let expected = 'Garbage';

    let props = ListItem.getDerivedStateFromProps(expected);
    t.is(props, expected, 'Props update is not accepted as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------          render          ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[ListItem render] renders without crashing', async (t) => {
    let div = document.createElement('div');
    let props = {
        "data": 'Garbage',
        "styleClass": "some-class"
    };

    ReactDOM.render(
        React.createElement(ListItem, props),
        div
    );

    t.is(div.getElementsByClassName('some-class').length, 1);
});
