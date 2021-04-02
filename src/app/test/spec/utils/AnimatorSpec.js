/**
 * FILENAME:    AnimatorSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 23rd, 2021
 *
 * This file contains the test specification for the Animator utility class.
 */

import test from 'ava';
import sinon from 'sinon';

import Animator from '@utils/Animator.js';
import Watchers from '@test.utils/Watchers.js';


const w = new Watchers();

test.before((t) => {
    t.context.animator = {
        ...w.getAllWatchers('Animator'),
        "ele": document.createElement('div')
    };
});

test.beforeEach(() => {});

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


async function macroTickFade({
    t,
    expected,
    watcher,
    callback = () => null,
    direction = 'In',
    duration = 100,
    last = 0,
    shortcircuit = 1
}) {
    t.context.animator.dateNow.onFirstCall().returns(Date.now.wrappedMethod());

    let wrapper = async () => {
        await Animator._tickFade(
            direction, t.context.animator.ele, duration, 0, callback, last
        );

        if (t.title.includes('opacity')) {
            t.assert(parseFloat(t.context.animator.ele.style.opacity) <= 1, 'Element opacity > 1');
        }

        return watcher.callCount;
    };

    t.is(await wrapper(), expected, 'Watched function was not the expected number of times');
    t.is(t.context.animator.windowRequestAnimationFrame.callCount + t.context.animator.windowSetTimeout.callCount, shortcircuit, 'Unexpected ending');
};

async function macroTickSlide({
    t,
    expected,
    watcher,
    callback = () => null,
    displace = () => null,
    duration = 100,
    start = Date.now.wrappedMethod(),
    shortcircuit = 1
}) {
    t.context.animator.animatorTickSlide.callThrough();
    t.context.animator.dateNow.onFirstCall().returns(Date.now.wrappedMethod());

    let wrapper = async () => {
        await Animator._tickSlide(
            duration, displace, callback, start
        );

        return watcher.callCount;
    };

    t.is(await wrapper(), expected, 'Watched function was not the expected number of times');
    t.is(t.context.animator.windowRequestAnimationFrame.callCount, shortcircuit, 'Unexpected ending');
}

async function macroScroll({
    t,
    expected,
    next = window.document.createElement('div')
}) {
    let watcher = t.context.animator;

    await Animator.scroll(next);

    if (next !== 'Garbage') {
        // Check that manual scrolling has been disabled.
        t.not(window.onwheel, null, 'Wheel scrolling was not disabled');

        watcher.animatorTickSlide.callArg(1);
        watcher.animatorTickSlide.callArg(2);
    }

    // Reset (HTML input) or don't set (invalid input) window.onwheel
    t.is(window.onwheel, null, 'Wheel scrolling was not reset');
    t.is(watcher.animatorSlide.callCount, expected, 'Animator.slide was not called the expected number of times');
    t.is(watcher.windowScrollTo.callCount, expected, 'Window.scrollTo was not called the expected number of times');
}

async function macroTutorialScroll({
    t,
    expected,
    current = window.document.createElement('div'),
    next = window.document.createElement('div')
}) {
    let watcher = t.context.animator;

    await Animator.tutorialScroll(current, next);

    if (![current, next].includes('Garbage')) {
        // Check that manual scrolling has been disabled.
        t.not(window.onwheel, null, 'Wheel scrolling was not disabled');

        watcher.animatorTickSlide.callArg(1);
        watcher.animatorTickSlide.callArg(2);

        t.false(next.classList.contains('hide'));
        t.true(current.classList.contains('hide'));
    }

    // Reset (HTML input) or don't set (invalid input) window.onwheel.
    t.is(window.onwheel, null, 'Wheel scrolling was not reset');
    t.is(watcher.animatorSlide.callCount, expected, 'Animator.slide was not called the expected number of times');
    t.is(watcher.windowScrollTo.callCount, expected, 'Window.scrollTo was not called the expected number of times');
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroDuration(t, input, w = t.context.animator.mathMin) {
    return {
        "duration": input,
        "watcher": w
    };
}

function minimacroLast(t, input) {
    return {
        "last": input,
        "watcher": t.context.animator.dateNow
    };
}

function minimacroOpacity(t, input) {
    t.context.animator.ele.style.opacity = input;
    t.context.animator.dateNow.onSecondCall().returns(Date.now.wrappedMethod());

    // So that [opactity < 1] isn't min'd to 1, (Date.now() - last) must be less than duration; doesn't increase call count.
    return {
        "watcher": t.context.animator.windowRequestAnimationFrame,
        "last": Date.now.wrappedMethod() - 10
    };
}

function minimacroStart(t, input) {
    return {
        "start": input,
        "watcher": t.context.animator.mathMin
    };
}

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

function minimacroNext(input, current = window.document.createElement('div')) {
    let c = window.document.createElement('div');

    if (input !== 'Garbage') {
        input = minimacroWrap(c, input, 'content-section-footer');
    }

    return {
        "current": current,
        "next": input
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */



/**
 * Tests are run serially because they compete for details of the fakes, and verifying those details concurrently while they're all using one fake is hard.
 * Multiple fake instances of a method, commonly monitored, is not allowed.
 */


/* -------------------------------------------------------------------------- *\
|* ---------------------------- fadeIn / fadeOut ---------------------------- *|
|* -                   element, duration, delay, callback                   - *|
\* -------------------------------------------------------------------------- */

test.serial('[fadeIn] is executed fully', async (t) => {
    let expected = 1;

    await Animator.fadeIn(t.context.animator.ele, 1);

    t.is(t.context.animator.animatorTickFade.callCount, expected);
});

test.serial('[fadeOut] is executed fully', async (t) => {
    let expected = 1;

    t.log('_tickFade is called');
    await Animator.fadeOut(t.context.animator.ele, 1);

    t.is(t.context.animator.animatorTickFade.callCount, expected);
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------      slide      ----------------------------- *|
|* -                      duration, display, callback                       - *|
\* -------------------------------------------------------------------------- */

test.serial('[slide] is executed fully', async (t) => {
    let expected = 1;

    t.log('_tickSlide is called');
    await Animator.slide(0, () => null, () => null);

    t.is(t.context.animator.animatorTickSlide.callCount, expected);
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------    _tickFade    ----------------------------- *|
|* -        fadeDirection, element, duration, delay, callback, last         - *|
\* -------------------------------------------------------------------------- */

test.serial('[_tickFade] is executed fully when callback is set', async (t) => {
    let input = () => null;
    let expected = 1;
    let w, cb = w = sinon.spy(input);


    // Pass the spied-on function, not the original.
    t.context.animator.windowSetTimeout.callsArg(0);

    t.log('Callback is called');
    macroTickFade({
        "t": t,
        "expected": expected,
        "callback": cb,
        "watcher": w
    });
});


test.serial('[_tickFade] is executed fully when opacity < 1', async (t) => {
    let input = 0.1;
    let expected = 1;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickFade] is short circuit when opacity < 0 on "Out"', async (t) => {
    let input = -1;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": 'Out',
        ...args
    });
});

test.serial('[_tickFade] is short circuit when opacity = 0 on "Out"', async (t) => {
    let input = 0;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": 'Out',
        ...args
    });
});

test.serial('[_tickFade] is short circuit when opacity = 1 on "In"', async (t) => {
    let input = 1;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickFade] is short circuit when opacity > 1 on "In"', async (t) => {
    let input = 2;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('[_tickFade] is short circuit when duration < 0 on "In"]', async (t) => {
    let input = -2;
    let expected = 0;

    t.log('Math.min is not called (direction = "In")');
    let args = minimacroDuration(t, input, t.context.animator.mathMin);
    macroTickFade({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickFade] is short circuit when duration = 0 on "In"]', async (t) => {
    let input = 0;
    let expected = 0;

    t.log('Math.min is not called (direction = "In")');
    let args = minimacroDuration(t, input, t.context.animator.mathMin);
    macroTickFade({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickFade] is executed fully when duration > 0 on "In"', async (t) => {
    let input = 2;
    let expected = 1;

    t.log('Math.min is called once (direction = "In")');
    let args = minimacroDuration(t, input, t.context.animator.mathMin);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickFade] is short circuit when duration < 0 on "Out"', async (t) => {
    let input = -2;
    let expected = 0;

    t.log('Math.max is not called (direction = "Out")');
    let args = minimacroDuration(t, input, t.context.animator.mathMax);
    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": 'Out',
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickFade] is executed fully when duration = 0 on "Out"', async (t) => {
    let input = 0;
    let expected = 0;

    t.log('Math.max is called once (direction = "Out")');
    let args = minimacroDuration(t, input, t.context.animator.mathMax);
    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": 'Out',
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickFade] is executed fully when duration > 0 on "Out"', async (t) => {
    let input = 2;
    let expected = 1;

    t.log('Math.max is called once (direction = "Out")');
    let args = minimacroDuration(t, input, t.context.animator.mathMax);
    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": 'Out',
        ...args
    });
});


test.serial('[_tickFade] is executed fully when last < Date.now()', async (t) => {
    let input = 0;
    let expected = 2;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickFade] is executed fully when last = Date.now()', async (t) => {
    let input = Date.now.wrappedMethod();
    let expected = 2;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickFade] is short circuit when last > Date.now()', async (t) => {
    let input = 2 * Date.now.wrappedMethod();
    let expected = 1;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});


test.serial('[_tickFade] is executed fully when fade = "In"', async (t) => {
    let input = 'In';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "watcher": t.context.animator.mathMin
    });
});

test.serial('[_tickFade] is executed fully when fade = "Out"', async (t) => {
    let input = 'Out';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "watcher": t.context.animator.mathMax
    });
});

test.serial('[_tickFade] is short circuit when fade = "Garbage"', async (t) => {
    let input = 'Garbage';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "shortcircuit": 0,
        "watcher": t.context.animator.dateNow
    });
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------    _tickSlide    ---------------------------- *|
|* -                  duration, displace, callback, start                   - *|
\* -------------------------------------------------------------------------- */

test.serial('[_tickSlide] is executed fully when callback is set', async (t) => {
    let expected = 1;
    let input = () => null;
    let w, cb = w = sinon.spy(input);

    t.log('Callback is called');
    macroTickSlide({
        "t": t,
        "expected": expected,
        "callback": cb,
        "shortcircuit": 0, // The callback is called instead.
        "start": 0, // To force progress > 1.
        "watcher": w
    });
});


test.serial('[_tickSlide] is executed fully when displace is a function', async (t) => {
    let input = sinon.spy();
    let expected = 1;

    t.context.animator.dateNow.onSecondCall().returns(Date.now.wrappedMethod());

    t.log('Displace is called');
    macroTickSlide({
        "t": t,
        "expected": expected,
        "displace": input,
        "watcher": input
    });
});

test.serial('[_tickSlide] is short circuit when displace is not a function', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    macroTickSlide({
        "t": t,
        "expected": expected,
        "displace": input,
        "shortcircuit": 0,
        "watcher": t.context.animator.mathMin
    });
});


test.serial('[_tickSlide] is short circuit when duration < 0', async (t) => {
    let input = -2;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickSlide] is short circuit when duration = 0', async (t) => {
    let input = 0;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickSlide] is executed fully when duration > 0', async (t) => {
    let input = 2;
    let expected = 1;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('[_tickSlide] is executed fully when start < Date.now()', async (t) => {
    let input = 0;
    let expected = 1;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});

test.serial('[_tickSlide] is executed fully when start = Date.now()', async (t) => {
    let input = Date.now.wrappedMethod();
    let expected = 1;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[_tickSlide] is short circuit when start > Date.now()', async (t) => {
    let input = 2 * Date.now.wrappedMethod();
    let expected = 0;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------     scroll     ----------------------------- *|
|* -                                 next                                   - *|
\* -------------------------------------------------------------------------- */

test.serial('[scroll] is executed fully when next = HTML object', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(input);
    macroScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[scroll] is short circuit when next != HTML object', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(input);
    macroScroll({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------- tutorialScroll ----------------------------- *|
|* -                             current, next                              - *|
\* -------------------------------------------------------------------------- */

test.serial('[tutorialScroll] is executed fully when current = HTML object', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroCurrent(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[tutorialScroll] is short circuit when current != HTML object', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroCurrent(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});


test.serial('[tutorialScroll] is executed fully when next.class = ribbon-section-footer', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[tutorialScroll] is executed fully when next.class = content-section-footer', async (t) => {
    let input = document.createElement('div');
    let expected = 1;

    let args = minimacroNext(input);
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('[tutorialScroll] is short circuit when next != HTML object', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    let args = minimacroNext(input, 'GarbageCurrent');
    macroTutorialScroll({
        "t": t,
        "expected": expected,
        "shortcircuit": 0,
        ...args
    });
});
