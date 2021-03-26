import test from 'ava';

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

async function macroScroll({ t, expected,
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

    await FnScroll.tutorialScroll(current, next);

    if (![current, next].includes('Garbage')) {
        watcher.animatorTickSlide.callArg(1);
        watcher.animatorTickSlide.callArg(2);

        t.not(next.classList.contains('hide'));
    }

    // Reset (HTML input) or don't set (invalid input) window.onwheel.
    t.is(window.onwheel, null);
    t.is(watcher.animatorSlide.callCount, expected);
    t.is(watcher.windowScrollTo.callCount, expected);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */

function minimacroWrap(child, wrapper, className) {
    child.classList.add(className, 'hide');
    wrapper.appendChild(child);

    return wrapper;
}

function minimacroCurrent(input) {
    let w = window.document.createElement('div');

    if (input !== 'Garbage') {
        w = minimacroWrap(input, w, 'section-footer');
    }

    return {
        "current": input,
        "next": w
    };
}

function minimacroNext(input) {
    let c = window.document.createElement('div');

    if (input !== 'Garbage') {
        input = minimacroWrap(c, input, 'content-section-footer');
    }

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

    let args = minimacroNext(input);
    macroScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('scroll [next != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(input);
    macroScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------- tutorialScroll ----------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('tutorialScroll [current = HTML object]', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroCurrent(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('tutorialScroll [current != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroCurrent(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('tutorialScroll [next = ribbon-section-footer]', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('tutorialScroll [next = content-section-footer]', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('tutorialScroll [next != HTML object]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});
