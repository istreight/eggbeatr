import test from 'ava';
import sinon from 'sinon';

import Animator from '@functions/Animator.js';


test.before(t => {
    Object.assign(window, { requestAnimationFrame: () => null });

    t.context = {
        "ele": document.createElement('div')
    };
});

test.beforeEach(t => {
    let newContext = {
        "stubDateNow": sinon.stub(Date, 'now'),
        "stubRAF": sinon.stub(window, 'requestAnimationFrame')
    };

    t.context = {...t.context, ...newContext }
});

test.afterEach.always(t => {
    // Restore the default Sinon sandbox.
    sinon.restore();
});

test.after.always(t => {});

/* ========================================================================== *\
|*                                                                            *|
|*                                  MACROS                                    *|
|*                                                                            *|
\* ========================================================================== */

async function macroTickFade(t, input, expected) {
    let watcher, callback;

    let last = 0;
    let duration = 1;

    // Set opacity to 1 to avoid calling 'requestAnimationFrame'.
    t.context.ele.style.opacity = 1;

    if (/\[callback.*\]/.test(t.title)) {
        watcher = sinon.spy(input);
        sinon.stub(window, 'setTimeout').callsArg(0);

        // Pass the spied-on function, not the original.
        callback = watcher;
    } else if (/\[duration.*\]/.test(t.title)) {
        duration = input;
        watcher = t.context.stubDateNow;
    } else if (/\[last.*\]/.test(t.title)) {
        last = input;
        watcher = t.context.stubDateNow;
        watcher.onFirstCall().returns(Date.now.wrappedMethod());
    } else if (/\[opacity.*\]/.test(t.title)) {
        // This breaks with the Date.now watcher.
        Date.now.restore();

        // So that [opactity < 1] isn't min'd to 1, (Date.now() - last) must be less than duration.
        // This produces an automatic pass while watching Date.now.
        last = Date.now();

        watcher = t.context.stubRAF;
        t.context.ele.style.opacity = input;
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    let wrapper = async () => {
        await Animator._tickFade(
            t.context.ele, duration, 0, callback, last
        );

        if (t.title.includes('opacity')) {
            t.assert(parseFloat(t.context.ele.style.opacity) <= 1);
        }

        return watcher.callCount;
    };

    t.is(await wrapper(), expected);
};

/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */

test('_tickFade [callback]', macroTickFade, () => null, 1);

// These are too fast, they stack wrapping 'window.requestAnimationFrame'.
test.serial('_tickFade [opacity > 1]', macroTickFade, 2, 0);
test.serial('_tickFade [opacity = 1]', macroTickFade, 1, 0);
test.serial('_tickFade [opacity < 1]', macroTickFade, .5, 1);

// These are too fast, they stack wrapping 'Date.now'.
test.serial('_tickFade [duration > 0]', macroTickFade, 1, 2);
test.serial('_tickFade [duration = 0]', macroTickFade, 0, 1);
test.serial('_tickFade [duration < 0]', macroTickFade, -1, 1);

// These are too fast, they stack wrapping 'Date.now'.
let n = Date.now() || Date.now.wrappedMethod();
test.serial('_tickFade [last > Date.now()]', macroTickFade, 2 * n, 1);
test.serial('_tickFade [last = Date.now()]', macroTickFade, n, 2);
test.serial('_tickFade [last < Date.now()]', macroTickFade, 0, 2);
