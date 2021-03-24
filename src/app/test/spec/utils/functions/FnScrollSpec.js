import test from 'ava';
import sinon from 'sinon';

import Watchers from '@utils/watchers.js';
import FnScroll from '@functions/FnScroll.js';


const w = new Watchers();

test.before(t => {
    t.context.fnScroll = {
        ...w.getAllWatchers('FnScroll')
    };
});

test.beforeEach((t) => {
    // [root: test/spec] e.g., 'components/componentSpec.js'
    t.log('utils/functions/FnScrollSpec.js');
});

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

async function macroScroll(t, input, expected) {
    let watcher;

    if (/\[regex.*\]/.test(t.title)) {
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    await FnScroll.scroll(input);

    t.is(window.onwheel, null);
    t.is(watcher.callCount, expected);
}

/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn1      ------------------------------ *|
\* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn2      ------------------------------ *|
\* -------------------------------------------------------------------------- */
