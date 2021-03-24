import test from 'ava';
import sinon from 'sinon';

import Watchers from '@utils/watchers.js';
import Animator from '@functions/Animator.js';


const w = new Watchers();

test.before(t => {
    t.context = {
        ...w.getAllWatchers('Animator'),
        "ele": document.createElement('div')
    };
});

test.beforeEach(t => {
    t.log('utils/functions/AnimatorSpec.js');
});

test.afterEach.always(t => {
    // Reset the state of all fakes in the Watchers instance.
    w.reset();
});

test.after.always(t => {
    // Restore the Watchers instance sandbox.
    w.restore();
});

/* ========================================================================== *\
|*                                                                            *|
|*                                  MACROS                                    *|
|*                                                                            *|
\* ========================================================================== */

async function macroTickFade(t, input, expected) {
    let watcher, callback;

    let last = 0;
    let duration = 10;
    let direction = 'In';

    // Set opacity to 1 to avoid calling 'requestAnimationFrame'.
    t.context.ele.style.opacity = 1;

    if (/\[callback.*\]/.test(t.title)) {
        watcher = sinon.spy(input);
        t.context.windowSetTimeout.callsArg(0);

        // Pass the spied-on function, not the original.
        callback = watcher;
    } else if (/\[duration.*\]/.test(t.title)) {
        duration = input;
        watcher = t.context.dateNow;
    } else if (/\[fade.*\]/.test(t.title)) {
        direction = input;

        if (input === 'In') {
            watcher = t.context.math.min;
        } else if (input === 'Out') {
            watcher = t.context.math.max;
        } else {
            watcher = t.context.dateNow;
        }
    } else if (/\[last.*\]/.test(t.title)) {
        last = input;
        watcher = t.context.dateNow;
        watcher.onFirstCall().returns(Date.now.wrappedMethod());
    } else if (/\[opacity.*\]/.test(t.title)) {
        // So that [opactity < 1] isn't min'd to 1, (Date.now() - last) must be less than duration; doesn't increase call count.
        last = Date.now.wrappedMethod();

        t.context.ele.style.opacity = input;
        watcher = t.context.windowRequestAnimationFrame;
        t.context.dateNow.onFirstCall().returns(Date.now.wrappedMethod());
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    let wrapper = async () => {
        await Animator._tickFade(
            direction, t.context.ele, duration, 0, callback, last
        );

        if (t.title.includes('opacity')) {
            t.assert(parseFloat(t.context.ele.style.opacity) <= 1);
        }

        return watcher.callCount;
    };

    t.is(await wrapper(), expected);
};

async function macroFade(t, input, expected) {
    if (input === 'In') {
        await Animator.fadeIn(
            t.context.ele, 1
        );
    } else if (input === 'Out') {
        await Animator.fadeOut(
            t.context.ele, 1
        );
    }

    t.is(t.context.animatorTickFade.callCount, expected);
}

/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */

test('_tickFade [callback]', macroTickFade, () => null, 1);

// These are too fast, they stack wrapping 'window.requestAnimationFrame'.
test.serial('_tickFade [opacity > 1]', macroTickFade, 2, 0);
test.serial('_tickFade [opacity = 1]', macroTickFade, 1, 0);
test.serial('_tickFade [opacity < 1]', macroTickFade, .1, 1);

// These are too fast, they stack wrapping 'Date.now'.
test.serial('_tickFade [duration > 0]', macroTickFade, 1, 2);
test.serial('_tickFade [duration = 0]', macroTickFade, 0, 1);
test.serial('_tickFade [duration < 0]', macroTickFade, -1, 1);

// These are too fast, they stack wrapping 'Date.now'.
let n = Date.now() || Date.now.wrappedMethod();
test.serial('_tickFade [last > Date.now()]', macroTickFade, 2 * n, 1);
test.serial('_tickFade [last = Date.now()]', macroTickFade, n, 2);
test.serial('_tickFade [last < Date.now()]', macroTickFade, 0, 2);

// These are too fast, they stack wrapping 'Date.now'.
test.serial('_tickFade [fade = "In"]', macroTickFade, 'In', 1);
test.serial('_tickFade [fade = "Out"]', macroTickFade, 'Out', 1);
test.serial('_tickFade [fade = "Garbage"]', macroTickFade, 'Garbage', 1);

test.serial('fade [_tickFade called on fadeIn]', macroFade, 'In', 1);
test.serial('fade [_tickFade called on fadeOut]', macroFade, 'Out', 1);
test.serial('fade [_tickFade not called]', macroFade, 'In&Out', 0);
