import test from 'ava';
import sinon from 'sinon';

import Watchers from '@utils/watchers.js';


const w = new Watchers();

test.before(t => {
    t.context = {
        ...w.getAllWatchers('module')
    };
});

test.beforeEach((t) => {
    // [root: test/spec] e.g., 'components/componentSpec.js'
    t.log('path/to/moduleSpec.js');
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

async function macro(t, input, expected) {
    let watcher;

    if (/\[regex.*\]/.test(t.title)) {
        // Configure based on title...
    } else {
        // No configuration for unrecognized title.
        t.fail();
    }

    let wrapper = async () => {
        await File.fn(input);

        return watcher.watchedAttribute;
    };

    t.is(await wrapper(), expected);
}

/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn1      ------------------------------ *|
\* -------------------------------------------------------------------------- */
test.serial('fn1 [fn1 = expected]', macro, 'input', 'expected');

/* -------------------------------------------------------------------------- *\
|* ------------------------------     fn2      ------------------------------ *|
\* -------------------------------------------------------------------------- */
test.serial('fn2 [fn2 = expected]', macro, 'input', 'expected');
