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

async function macroDrawLines({ t, expected,
    doc = {}, lineCoordinates = [], tableCoordinates = []
}) {
    let res = e._drawLines(doc, lineCoordinates, tableCoordinates);

    if (doc && doc.line) {
        t.is(doc.line.callCount, expected);
    }

    t.deepEqual(res, undefined);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroData(t, input) {
    return {
        "data": input
    };
}

function minimacroDoc(t, input) {
    return {
        "doc": input
    };
}

function minimacroLineCoordinates(t, input) {
    return {
        "doc": { "line": sinon.stub() },
        "tableCoordinates": [0, 0, 0, 0],
        "lineCoordinates": input
    };
}

function minimacroTableCoordinates(t, input) {
    return {
        "doc": { "line": sinon.stub() },
        "tableCoordinates": input
    };
}

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

test.serial('_didDrawPage [data = object]', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroData(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data != object]', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroData(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data keys w/ sub keys]', async (t) => {
    let input = { "doc": {
        "text": sinon.stub()
    }, "cursor": {
        "x": 1,
        "y": 1
    }, "settings": {
        "startY": 1
    } };
    let expected = [1, 1, 1, 1];

    let args = minimacroData(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data keys w/o sub keys]', async (t) => {
    let input = { "doc": {}, "cursor": {}, "settings": {} };
    let expected = undefined;

    let args = minimacroData(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data keys w/ only doc.text]', async (t) => {
    let input = { "doc": {
        "text": sinon.stub()
    }, "cursor": {}, "settings": {} };
    let expected = [undefined, undefined, undefined, undefined];

    let args = minimacroData(t, input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});


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


/* -------------------------------------------------------------------------- *\
|* ------------------------------  _drawLines  ------------------------------ *|
\* -------------------------------------------------------------------------- */

test.serial('_drawLines [doc = object]', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroDoc(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [doc != object]', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroDoc(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_drawLines [tableCoordinates.length = 0]', async (t) => {
    let input = [];
    let expected = 0;

    let args = minimacroTableCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.length < 4]', async (t) => {
    let input = [0, 1, 2];
    let expected = 0;

    let args = minimacroTableCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.length = 4]', async (t) => {
    let input = [0, 1, 2, 3];
    let expected = 2;

    let args = minimacroTableCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.values != number]', async (t) => {
    let input = [0, '1', [], {}];
    let expected = 0;

    let args = minimacroTableCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_drawLines [lineCoordinates.length = 0]', async (t) => {
    let input = [];
    let expected = 2;

    let args = minimacroLineCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates.length > 1]', async (t) => {
    let input = [[0, 1, 2, 3], [4, 5, 6, 7]];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.length < 4]', async (t) => {
    let input = [[0, 1, 2], [4, 5, 6, 7]];
    let expected = 3; // tableCoordinates: 2, valid inputs: 1

    let args = minimacroLineCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.length = 4]', async (t) => {
    let input = [[0, 1, 2, 3]];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.values != number]', async (t) => {
    let input = [[0, '1', [], {}]];
    let expected = 2;

    let args = minimacroLineCoordinates(t, input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});
