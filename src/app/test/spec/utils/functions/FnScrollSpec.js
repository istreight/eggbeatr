import test from 'ava';
import jsdom from 'jsdom';
import sinon from 'sinon';

import Watchers from '@utils/watchers.js';
import FnScroll from '@functions/FnScroll.js';


const { JSDOM } = jsdom;
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

async function macroScroll({ t, expected,
        current = window.document.createElement('div'),
        next = window.document.createElement('div')
}) {
    let watcher = t.context.fnScroll;

    await FnScroll.scroll(next);

    if (next !== 'Garbage') {
        watcher.animatorTickSlide.callArg(1);
        watcher.animatorTickSlide.callArg(2);
    }

    // Reset (HTML input) or don't set (invalid input) window.onwheel.
    t.is(window.onwheel, null);
    t.is(watcher.animatorSlide.callCount, expected);
    t.is(watcher.windowScrollTo.callCount, expected);
}

async function macroTutorialScroll({ t, expected,
        current = window.document.createElement('div'),
        next = window.document.createElement('div')
}) {
    let watcher = t.context.fnScroll;
    const { window } = new JSDOM(`...`);

    await FnScroll.tutorialScroll(current, next);

    // Reset (HTML input) or don't set (invalid input) window.onwheel.
    t.is(window.onwheel, null);
    t.is(watcher.animatorSlide.callCount, expected);
    t.is(watcher.windowScrollTo.callCount, expected);
}

async function _macroTutorialScroll(t, input, expected) {
    let current, next;
    let watcher = t.context.fnScroll;
    const { window } = new JSDOM(`...`);

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

    t.pass();
    /*
    t.is(window.onwheel, null); // Reset (HTML input) or not set (invalid input)
    t.is(watcher.animatorSlide.callCount, expected);
    t.is(watcher.windowScrollTo.callCount, expected);
    */
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroCurrent(t, input) {
    return {
        "current": input,
        "next": window.document.createElement('div')
    };
}

function minimacroNext(t, input) {
    return {
        "current": window.document.createElement('div'),
        "next": input
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* -----------------------------     scroll     ----------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('scroll [next = HTML object]', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(t, input);
    macroScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('scroll [next != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(t, input);
    macroScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------- tutorialScroll ----------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('tutorialScroll [current != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroCurrent(t, input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('tutorialScroll [next != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(t, input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});
