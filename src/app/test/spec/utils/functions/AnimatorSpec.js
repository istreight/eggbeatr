import test from 'ava';
import sinon from 'sinon';

import Watchers from '@utils/watchers.js';
import Animator from '@functions/Animator.js';


const w = new Watchers();

test.before((t) => {
    t.context.animator = {
        ...w.getAllWatchers('Animator'),
        "ele": document.createElement('div')
    };
});

test.beforeEach((t) => {
    t.log('utils/functions/AnimatorSpec.js');
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



async function macroTickFade({ t, expected, watcher,
    callback = () => null, direction = 'In', duration = 100, last = 0
}) {
    t.context.animator.dateNow.onFirstCall().returns(Date.now.wrappedMethod());

    let wrapper = async () => {
        await Animator._tickFade(
            direction, t.context.animator.ele, duration, 0, callback, last
        );

        if (t.title.includes('opacity')) {
            t.assert(parseFloat(t.context.animator.ele.style.opacity) <= 1);
        }

        return watcher.callCount;
    };

    t.is(await wrapper(), expected);
};

async function macroTickSlide({ t, expected, watcher,
    callback = () => null, displace = () => null,
    duration = 100, start = 0
}) {
    t.context.animator.dateNow.onFirstCall().returns(Date.now.wrappedMethod());

    let wrapper = async () => {
        await Animator._tickSlide(
            duration, displace, callback, start
        );

        return watcher.callCount;
    };

    t.is(await wrapper(), expected);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroDuration(t, input) {
    return {
        "duration": input,
        "watcher": t.context.animator.mathMin
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
\* -------------------------------------------------------------------------- */

test.serial('fade [_tickFade called on fadeIn]', async (t) => {
    let expected = 1;

    await Animator.fadeIn(t.context.animator.ele, 1);

    t.is(t.context.animator.animatorTickFade.callCount, expected);
});

test.serial('fade [_tickFade called on fadeOut]', async (t) => {
    let expected = 1;

    await Animator.fadeOut(t.context.animator.ele, 1);

    t.is(t.context.animator.animatorTickFade.callCount, expected);
});



/* -------------------------------------------------------------------------- *\
|* ----------------------------      slide      ----------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('slide [_tickSlide called on slide]', async (t) => {
    let expected = 1;

    await Animator.slide(0, () => null, () => null);

    t.is(t.context.animator.animatorTickSlide.callCount, expected);
});



/* -------------------------------------------------------------------------- *\
|* ----------------------------    _tickFade    ----------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('_tickFade [callback]', async (t) => {
    let w, cb;
    let input = () => null;
    let expected = 1;

    w = sinon.spy(input);
    t.context.animator.windowSetTimeout.callsArg(0);

    // Pass the spied-on function, not the original.
    cb = w;

    macroTickFade({
        "t": t,
        "expected": expected,
        "callback": cb,
        "watcher": w
    });
});


test.serial('_tickFade [opacity < 1]', async (t) => {
    let input = 0;
    let expected = 1;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [opacity = 1]', async (t) => {
    let input = 1;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [opacity > 1]', async (t) => {
    let input = 2;
    let expected = 0;

    let args = minimacroOpacity(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_tickFade [duration < 0]', async (t) => {
    let input = -1;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [duration = 0]', async (t) => {
    let input = 0;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [duration > 0]', async (t) => {
    let input = 1;
    let expected = 1;

    let args = minimacroDuration(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_tickFade [last < Date.now()]', async (t) => {
    let input = 0;
    let expected = 2;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [last = Date.now()]', async (t) => {
    let input = Date.now.wrappedMethod();
    let expected = 2;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickFade [last > Date.now()]', async (t) => {
    let input = 2 * Date.now.wrappedMethod();
    let expected = 1;

    let args = minimacroLast(t, input);
    macroTickFade({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_tickFade [fade = "In"]', async (t) => {
    let input = 'In';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "watcher": t.context.animator.mathMin
    });
});

test.serial('_tickFade [fade = "Out"]', async (t) => {
    let input = 'Out';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "watcher": t.context.animator.mathMax
    });
});

test.serial('_tickFade [fade = "Garbage"]', async (t) => {
    let input = 'Garbage';
    let expected = 1;

    macroTickFade({
        "t": t,
        "expected": expected,
        "direction": input,
        "watcher": t.context.animator.dateNow
    });
});


/* -------------------------------------------------------------------------- *\
|* ----------------------------    _tickSlide    ---------------------------- *|
\* -------------------------------------------------------------------------- */

test.serial('_tickSlide [callback]', async (t) => {
    let cb;
    let expected = 1;
    let input = () => null;
    let w = sinon.spy(input);

    // Pass the spied-on function, not the original.
    cb = w;

    //{ t, expected, watcher, callback = () => null, displace = () => null, duration = 100, start = 0 }
    macroTickSlide({
        "t": t,
        "expected": expected,
        "callback": cb,
        "watcher": w
    });
});


test.serial('_tickSlide [displace = fn()]', async (t) => {
    let input = () => null;
    let expected = 1;

    let watcher, displace = watcher = sinon.spy(input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        "displace": displace,
        "watcher": watcher
    });
});

test.serial('_tickSlide [displace != fn()]', async (t) => {
    let input = 'Garbage';
    let expected = 0;

    macroTickSlide({
        "t": t,
        "expected": expected,
        "displace": input,
        "watcher": t.context.animator.mathMin
    });
});


test.serial('_tickSlide [duration < 0]', async (t) => {
    let input = -1;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickSlide [duration = 0]', async (t) => {
    let input = 0;
    let expected = 0;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickSlide [duration > 0]', async (t) => {
    let input = 1;
    let expected = 1;

    let args = minimacroDuration(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_tickSlide [start < Date.now()]', async (t) => {
    let input = 0;
    let expected = 1;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickSlide [start = Date.now()]', async (t) => {
    let input = Date.now.wrappedMethod();
    let expected = 1;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_tickSlide [start > Date.now()]', async (t) => {
    let input = 2 * Date.now.wrappedMethod();
    let expected = 0;

    let args = minimacroStart(t, input);
    macroTickSlide({
        "t": t,
        "expected": expected,
        ...args
    });
});
