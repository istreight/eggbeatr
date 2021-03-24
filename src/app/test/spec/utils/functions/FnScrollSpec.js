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
    let watcher = t.context.fnScroll;

    if (/\[next.*\]/.test(t.title)) {
        // No config required.
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    await FnScroll.scroll(input);

    t.is(window.onwheel, null); // Reset (HTML input) or not set (invalid input)
    t.is(watcher.animatorSlide.callCount, expected);
    t.is(watcher.windowScrollTo.callCount, expected);
}

/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* -----------------------------     scroll     ----------------------------- *|
\* -------------------------------------------------------------------------- */
test.serial('scroll [next = HTML object]', macroScroll, document.createElement('div'), 1);
test.serial('scroll [next != HTML object]', macroScroll, 'Garbage', 0);

/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn2      ------------------------------ *|
\* -------------------------------------------------------------------------- */
//test.serial('fn2 [fn2 = expected]', macro, 'input', 'expected');
