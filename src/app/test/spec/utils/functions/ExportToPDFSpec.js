/**
 * FILENAME:    ExportToPDFSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 26th, 2021
 *
 * This file contains the test specification for the ExportToPDF function class.
 */

import test from 'ava';
import sinon from 'sinon';

import Watchers from '@utils/Watchers.js';
import ExportToPDF from '@functions/ExportToPDF.js';

const w = new Watchers();
const e = new ExportToPDF();

test.before((t) => {
    t.context.exportToPDF = {
        ...w.getAllWatchers('ExportToPDF')
    };
});

test.beforeEach((t) => {
    t.log('utils/functions/ExportToPDFSpec.js');
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



async function macroDidDrawPage({ t, expected,
    data = {}, setTitle = ''
}) {
    let res = e._didDrawPage(data, setTitle);

    if (data.doc && data.doc.text) {
        t.assert(data.doc.text.calledWith("Grid - " + setTitle));
        t.is(data.doc.text.callCount, 1);
    }

    t.deepEqual(res, expected);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroSetTitle(t, input) {
    return {
        "data": { "doc": {
            "text": sinon.stub().returnsArg(0)
        }, "cursor": {}, "settings": {} },
        "setTitle": input
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* ------------------------------ _didDrawPage ------------------------------ *|
\* -------------------------------------------------------------------------- */

test.serial('_didDrawPage [setTitle]', async (t) => {
    let input = 'set title';
    let expected = [undefined, undefined, undefined, undefined];

    let args = minimacroSetTitle(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});
