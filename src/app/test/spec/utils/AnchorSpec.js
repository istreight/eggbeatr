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

test('[Anchor constructor] is executed fully', async (t) => {
    let input = new Anchor({ "key": "value" });
    let expected = {
        "node": null,
        "state": {
            "key": "value"
        }
    };

    t.is(input.node, expected.node, 'Anchor node is not set as expected');
    t.deepEqual(input.state, expected.state, 'Anchor state is not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------    componentDidMount     ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Anchor componentDidMount] is executed fully when props includes props with default values', async (t) => {
    let spy = sinon.spy();
    let div = document.createElement('div');
    let expected = {
        "callback": spy,
        "handleClick": () => 'returnValue',
        "styleClass": "some-class",
        "updateProps": false
    };

    t.log('State is made up of the props passed in');
    let anchor = ReactDOM.render(
        React.createElement(Anchor, expected),
        div
    );

    t.is(spy.callCount, 1, 'Anchor callback is called an unexpected number of times');
    t.not(anchor.node, null, 'Anchor node is set unexpectedly');
    t.not(anchor.state.hyperlink, null, 'Unspecified prop is set unexpectedly');
    t.deepEqual(anchor.state, expected, 'Anchor state is not set as expected');
});

test('[Anchor componentDidMount] is executed fully when props includes props without default values', async (t) => {
    let div = document.createElement('div');
    let expected = {
        "callback": () => null,
        "handleClick": () => 'returnValue',
        "styleClass": "some-class"
    };

    t.log('State is made up of the props passed in');
    let anchor = ReactDOM.render(
        React.createElement(Anchor, expected),
        div
    );

    t.not(anchor.node, null, 'Anchor node is set unexpectedly');
    t.not(anchor.state.hyperlink, null, 'Unspecified prop is set unexpectedly');
    t.deepEqual(anchor.state, {
        "updateProps": true,
        ...expected
    }, 'Anchor state is not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------ getDerivedStateFromProps ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Anchor getDerivedStateFromProps] is executed fully when updateProps is true', async (t) => {
    let expected = {
        "updateProps": true
    };

    let props = Anchor.getDerivedStateFromProps(expected, 'Garbage');
    t.is(props, expected, 'Props update is not accepted as expected');
});

test('[Anchor getDerivedStateFromProps] is executed fully when updateProps is not true', async (t) => {
    let expected = {
        "updateProps": false
    };

    let props = Anchor.getDerivedStateFromProps('Garbage', expected);
    t.is(props, expected, 'Props update is not rejected as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------          render          ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Anchor render] renders without crashing', async (t) => {
    let div = document.createElement('div');
    let props = {
        "handleClick": () => 'returnValue',
        "styleClass": "some-class"
    };

    ReactDOM.render(
        React.createElement(Anchor, props),
        div
    );

    t.is(div.getElementsByClassName('some-class').length, 1);
});
