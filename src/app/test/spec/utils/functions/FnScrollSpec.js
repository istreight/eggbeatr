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

async function macroTutorialScroll(t, input, expected) {
    let current, next;
    let watcher = t.context.fnScroll;
    let ele = document.createElement('div');

    if (/\[current.*\]/.test(t.title)) {
        current = input;
        next = ele;
    } else if (/\[next.*\]/.test(t.title)) {
        current = ele;
        next = input;
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    await FnScroll.tutorialScroll(current, next);

    if (input instanceof HTMLElement) {
        //console.log('classList', input);
        //console.log(input.classList.value);
        //console.log(input.classList.contains('hide'));
        //t.assert(input.classList.contains('hide'));
    }

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
|* ----------------------------- tutorialScroll ----------------------------- *|
\* -------------------------------------------------------------------------- */
test.serial('tutorialScroll [current != HTML object]', macroTutorialScroll, 'Garbage', 0);
test.serial('tutorialScroll [next != HTML object]', macroTutorialScroll, 'Garbage', 0);
