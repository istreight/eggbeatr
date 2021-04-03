/**
 * FILENAME:    InputSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 1st, 2021
 *
 * This file contains the test specification for the Input utility class.
 */

import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

import Input from '@utils/Input.js';


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

test('[Input constructor] is executed fully', async (t) => {
    let input = new Input({
        "key": "value"
    });
    let expected = {
        "state": {
            "key": "value"
        }
    };

    t.deepEqual(input.state, expected.state, 'State not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------    componentDidMount     ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Input componentDidMount] is executed fully when props includes props with default values', async (t) => {
    let spy = sinon.spy();
    let div = document.createElement('div');
    let expected = {
        "callback": spy,
        "checked": false,
        "handleBlur": () => null,
        "styleClass": "",
        "type": "text",
        "value": ""
    };

    t.log('State is made up of the props passed in');
    let input = ReactDOM.render(
        React.createElement(Input, expected),
        div
    );

    t.is(spy.callCount, 1, 'Callback called an unexpected number of times');
    t.deepEqual(input.state, expected, 'State not set as expected');
});

test('[Input componentDidMount] is executed fully when props includes props without default values', async (t) => {
    let div = document.createElement('div');
    let expected = {
        "callback": () => null,
        "handleBlur": () => null,
        "type": "text"
    };

    t.log('State is made up of the props passed in');
    let input = ReactDOM.render(
        React.createElement(Input, expected),
        div
    );

    t.deepEqual(input.state, {
        "checked": false,
        "styleClass": "",
        "value": "",
        ...expected
    }, 'State not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------       handleChange       ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Input handleChange] is executed fully', async (t) => {
    let props = {
        "type": 'text'
    };
    let expected = {
        "target": {
            "value": 'Garbage'
        }
    };

    let div = document.createElement('div');
    let input = React.createElement(Input, props);

    ReactDOM.render(input, div, function () {
        sinon.stub(this, 'setState').callsFake(() => this.state.value = expected.target.value);

        this.handleChange(expected);

        t.is(this.state.value, 'Garbage', 'Value not set as expected');
    });
});


/* -------------------------------------------------------------------------- *\
|* ------------------------          render          ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Input render] renders without crashing', async (t) => {
    let div = document.createElement('div');
    let props = {
        "type": 'text'
    };

    ReactDOM.render(
        React.createElement(Input, props),
        div
    );

    t.is(div.getElementsByTagName('input').length, 1);
});
