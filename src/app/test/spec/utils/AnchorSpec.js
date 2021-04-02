/**
 * FILENAME:    AnchorSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 1st, 2021
 *
 * This file contains the test specification for the Anchor utility class.
 */

import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

import Anchor from '@utils/Anchor.js';
import Watchers from '@test.utils/Watchers.js';


const w = new Watchers();

test.before((t) => {
    t.context.module = {
        ...w.getAllWatchers('Anchor')
    };
});

test.beforeEach((t) => {});

test.afterEach.always(() => {
    // Reset the state of all fakes in the Watchers instance.
    w.reset();
});

test.after.always(() => {
    // Restore the Watchers instance sandbox.
    w.restore();
});



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------       constructor        ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[constructor] is executed fully', async (t) => {
    let input = new Anchor();
    let expected = {
        "node": null,
        "state": {}
    };

    t.is(input.node, expected.node);
    t.deepEqual(input.state, expected.state);
});


/* -------------------------------------------------------------------------- *\
|* ------------------------    componentDidMount     ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[componentDidMount] is executed fully', async (t) => {
    let div = document.createElement('div');
    let expected = {
        "callback": () => 'not null',
        "handleClick": () => 'not null',
        "styleClass": "some-class",
        "updateProps": false
    };

    t.log('State is made up of the props passed in');
    let anchor = ReactDOM.render(
        React.createElement(Anchor, expected),
        div
    );

    t.not(anchor.node, null);
    t.deepEqual(anchor.state, expected);
});


/* -------------------------------------------------------------------------- *\
|* ------------------------ getDerivedStateFromProps ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[getDerivedStateFromProps] is executed fully when updateProps is true', async (t) => {
    let expected = {
        "updateProps": true
    };

    let props = Anchor.getDerivedStateFromProps(expected, 'Garbage');
    t.is(props, expected);
});

test('[getDerivedStateFromProps] is executed fully when updateProps is not true', async (t) => {
    let expected = {
        "updateProps": false
    };

    let props = Anchor.getDerivedStateFromProps('Garbage', expected);
    t.is(props, expected);
});


/* -------------------------------------------------------------------------- *\
|* ------------------------          render          ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[render] renders without crashing', async (t) => {
    let div = document.createElement('div');
    let props = {
        "handleClick": () => 'not null',
        "styleClass": "some-class"
    };

    ReactDOM.render(
        React.createElement(Anchor, props),
        div
    );

    t.is(div.getElementsByClassName('some-class').length, 1);
});
