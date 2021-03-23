import test from 'ava';
import sinon from 'sinon';

import Animator from '@functions/Animator.js';


test.before(t => {
    t.context = {
        "ele": document.createElement('div')
    };
});

test.beforeEach(t => {});

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
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    let wrapper = async () => {
        await Animator._tickFade(
            t.context.ele, duration, 0, callback, last
        );

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
