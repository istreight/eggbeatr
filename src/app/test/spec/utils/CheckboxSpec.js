/**
 * FILENAME:    CheckboxSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  April 1st, 2021
 *
 * This file contains the test specification for the Checkbox utility class.
 */

import test from 'ava';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

import Checkbox from '@utils/Checkbox.js';


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

test('[Checkbox constructor] is executed fully', async (t) => {
    let input = new Checkbox({ "key": "value" });
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

test('[Checkbox componentDidMount] is executed fully when props includes props with default values', async (t) => {
    let spy = sinon.spy();
    let div = document.createElement('div');
    let expected = {
        "callback": spy,
        "checked": false,
        "disabled": false,
        "handleChange": () => 'returnValue'
    };

    t.log('State is made up of the props passed in');
    let checkbox = ReactDOM.render(
        React.createElement(Checkbox, expected),
        div
    );

    t.is(spy.callCount, 1, 'Callback called an unexpected number of times');
    t.deepEqual(checkbox.state, expected, 'State not set as expected');
});

test('[Checkbox componentDidMount] is executed fully when props includes props without default values', async (t) => {
    let div = document.createElement('div');
    let expected = {
        "callback": () => 'returnValue',
        "handleChange": () => 'returnValue'
    };

    t.log('State is made up of the props passed in');
    let checkbox = ReactDOM.render(
        React.createElement(Checkbox, expected),
        div
    );

    t.deepEqual(checkbox.state, {
        "checked": false,
        "disabled": false,
        ...expected
    }, 'State not set as expected');
});


/* -------------------------------------------------------------------------- *\
|* ------------------------       handleChange       ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Checkbox handleChange] is executed fully when checked is false', async (t) => {
    let spy = sinon.spy();
    let props = {
        "checked": false,
        "disabled": false,
        "handleChange": spy
    };

    let div = document.createElement('div');
    let checkbox = React.createElement(Checkbox, props);

    ReactDOM.render(checkbox, div, function() {
        sinon.stub(this, 'setState').callsFake(() => this.state.checked = !this.state.checked);

        this.handleChange();

        t.is(spy.callCount, 1, 'HandleChange called an unexpected number of times');
        t.assert(this.state.checked, 'Checked not set as expected');
    });
});

test('[Checkbox handleChange] is executed fully when checked is true', async (t) => {
    let spy = sinon.spy();
    let props = {
        "checked": true,
        "disabled": false,
        "handleChange": spy
    };

    let div = document.createElement('div');
    let checkbox = React.createElement(Checkbox, props);

    ReactDOM.render(checkbox, div, function() {
        sinon.stub(this, 'setState').callsFake(() => this.state.checked = !this.state.checked);

        this.handleChange();

        t.is(spy.callCount, 1, 'HandleChange called an unexpected number of times');
        t.assert(!this.state.checked, 'Checked not set as expected');
    });
});


/* -------------------------------------------------------------------------- *\
|* ------------------------        setChecked        ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Checkbox setChecked] is executed fully', async (t) => {
    let expected = 'Garbage';
    let props = {
        "handleChange": () => null
    };

    let div = document.createElement('div');
    let checkbox = React.createElement(Checkbox, props);

    ReactDOM.render(checkbox, div, function() {
        sinon.stub(this, 'setState').callsFake(() => this.state.checked = expected);

        this.setChecked(expected);

        t.is(this.state.checked, expected, 'Checked not set as expected');
    });
});


/* -------------------------------------------------------------------------- *\
|* ------------------------       setDisabled        ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Checkbox setDisabled] is executed fully', async (t) => {
    let expected = 'Garbage';
    let props = {
        "handleChange": () => null
    };

    let div = document.createElement('div');
    let checkbox = React.createElement(Checkbox, props);

    ReactDOM.render(checkbox, div, function() {
        sinon.stub(this, 'setState').callsFake(() => this.state.disabled = expected);

        this.setDisabled(expected);

        t.is(this.state.disabled, expected,  'Disabled not set as expected');
    });
});


/* -------------------------------------------------------------------------- *\
|* ------------------------          render          ------------------------ *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test('[Checkbox render] renders without crashing', async (t) => {
    let div = document.createElement('div');
    let props = {
        "callback": () => 'returnValue',
        "handleChange": () => 'returnValue'
    };

    ReactDOM.render(
        React.createElement(Checkbox, props),
        div
    );

    t.is(div.getElementsByTagName('input').length, 1);
});
