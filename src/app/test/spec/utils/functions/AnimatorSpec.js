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
    } else if (/\[opacity.*\]/.test(t.title)) {
        // So that [opactity < 1] isn't min'd to 1, (Date.now() - last) must be less than duration.
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
