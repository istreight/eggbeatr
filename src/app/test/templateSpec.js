/**
 * FILENAME:    templateSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 24th, 2021
 *
 * This file is a skeleton of the specification files for the lesson calendar application. The intent of this file is to act as a starting point for new specifications.
 */

import test from 'ava';
import sinon from 'sinon';

import Watchers from '@test.utils/Watchers.js';


const w = new Watchers();

test.before((t) => {
    t.context.module = {
        ...w.getAllWatchers('module')
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
|*                                  MACROS                                    *|
|*                                                                            *|
\* ========================================================================== */

async function macro({ t, expected, watcher,
    fnParam = 'default'
}) {

    let wrapper = async () => {
        await File.fn(input, fnParam);

        return watcher.watchedAttribute;
    };

    t.is(await wrapper(), expected);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacro(t, input) {
    let w;

    // More set up specific to the module method...

    return {
        "watcher": w,
        "fnParam": 'not-the-default'
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn1      ------------------------------ *|
|* -                         parameter1, parameter2                         - *|
\* -------------------------------------------------------------------------- */
test.serial('fn1 [fn1 = expected]', async (t) => {
    let input = 'input';
    let expected = 'expected';

    let args = minimacro(t, input);
    macro({
        "t": t,
        "expected": expected,
        ...args
    });
});

/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn2      ------------------------------ *|
|* -                         parameter1, parameter2                         - *|
\* -------------------------------------------------------------------------- */
test.serial('fn2 [fn2 = expected]', async (t) => {
    let input = 'input';
    let expected = 'expected';

    let args = minimacro(t, input);
    macro({
        "t": t,
        "expected": expected,
        ...args
    });
});
