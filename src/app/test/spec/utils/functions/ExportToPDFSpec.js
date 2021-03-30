/**
 * FILENAME:    ExportToPDFSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 26th, 2021
 *
 * This file contains the test specification for the ExportToPDF function class.
 */

import test from 'ava';
import sinon from 'sinon';

import ExportToPDF from '@functions/ExportToPDF.js';

const e = new ExportToPDF();

test.before(() => {});

test.beforeEach((t) => {
    t.log('utils/functions/ExportToPDFSpec.js');
});

test.afterEach.always(() => {});

test.after.always(() => {});



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

async function macroDidDrawCell({ t, expected,
    cell = {}, prevCell = {}, splitCellLines = [], isSplitCell = true
}) {
    let res = e._didDrawCell(cell, prevCell, splitCellLines, isSplitCell);

    t.deepEqual(res, expected);
}

async function macroDidParseCell({ t, expected,
    cell, prevCell = {}, isSplitCell = true
}) {
    let res = e._didParseCell(cell, prevCell, isSplitCell);

    t.deepEqual(res, expected);
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroCell(input) {
    return {
        "cell": input,
        "prevCell": { "text": ["Strokes"] }
    };
}

function minimacroData(input) {
    return {
        "data": input
    };
}

function minimacroDoc(input) {
    return {
        "doc": input,
        "tableCoordinates": [0, 0, 0, 0],
        "lineCoordinates": []
    };
}

function minimacroIsSplitCell(input) {
    return {
        "cell": {
            "text": ['Work'],
            "x": 0,
            "y": 1,
            "width": 2,
            "height": 3,
            "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 }
        },
        "isSplitCell": input,
        "prevCell": { "text": ["Strokes"] }
    };
}

function minimacroLineCoordinates(input) {
    return {
        "doc": { "line": sinon.stub() },
        "tableCoordinates": [0, 0, 0, 0],
        "lineCoordinates": input
    };
}

function minimacroPrevCell(input, c =  { "text": ["Strokes"] }) {
    return {
        "cell": c,
        "prevCell": input
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

function minimacroSplitCellLines(input) {
    return {
        "cell": {
            "text": ['Work'],
            "x": 0,
            "y": 1,
            "width": 2,
            "height": 3
        },
        "splitCellLines": input,
        "prevCell": { "text": ["Strokes"] }
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* -----------------------------  _didDrawPage  ----------------------------- *|
|* -                             data, setTitle                             - *|
\* -------------------------------------------------------------------------- */

test.serial('_didDrawPage [data = object]', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data != object]', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data keys w/ sub-keys]', async (t) => {
    let input = { "doc": {
        "text": sinon.stub()
    }, "cursor": {
        "x": 1,
        "y": 1
    }, "settings": {
        "startY": 1
    } };
    let expected = [1, 1, 1, 1];

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawPage [data keys w/o sub-keys]', async (t) => {
    let input = { "doc": {}, "cursor": {}, "settings": {} };
    let expected = undefined;

    let args = minimacroData(input);
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

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didDrawPage [setTitle]', async (t) => {
    let input = 'set title';
    let expected = [undefined, undefined, undefined, undefined];

    let args = minimacroSetTitle(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------   _drawLines   ----------------------------- *|
|* -                 doc, lineCoordinates, tableCoordinates                 - *|
\* -------------------------------------------------------------------------- */

test.serial('_drawLines [doc = object]', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [doc != object]', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [doc.line = fn]', async (t) => {
    let input = { "line": sinon.stub() };
    let expected = 2;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [doc.line != fn]', async (t) => {
    let input = { "line": '() => null' };
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_drawLines [tableCoordinates = undefined]', async (t) => {
    let input = undefined;
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.length = 0]', async (t) => {
    let input = [];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.length < 4]', async (t) => {
    let input = [0, 1, 2];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.length = 4]', async (t) => {
    let input = [0, 1, 2, 3];
    let expected = 2;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [tableCoordinates.values != number]', async (t) => {
    let input = [0, '1', [], {}];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_drawLines [lineCoordinates.length = 0]', async (t) => {
    let input = [];
    let expected = 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates.length > 1]', async (t) => {
    let input = [[0, 1, 2, 3], [4, 5, 6, 7]];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.length < 4]', async (t) => {
    let input = [[0, 1, 2], [4, 5, 6, 7]];
    let expected = 3; // tableCoordinates: 2, valid inputs: 1

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.length = 4]', async (t) => {
    let input = [[0, 1, 2, 3]];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_drawLines [lineCoordinates subarray.values != number]', async (t) => {
    let input = [[0, '1', [], {}]];
    let expected = 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------  _didDrawCell  ----------------------------- *|
|* -              cell, prevCell, lineCoordinates, isSplitCell              - *|
\* -------------------------------------------------------------------------- */


test.serial('_didDrawCell [cell = object]', async (t) => {
    let input = {};
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell != object]', async (t) => {
    let input = '{}';
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell.text = array]', async (t) => {
    let input = { "text": ['Garbage'] };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell.text = 1/4 activity]', async (t) => {
    let input = { "text": ['Work'] };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell.text != array]', async (t) => {
    let input = { "text": 'Garbage' };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell.styles = object]', async (t) => {
    let input = { "styles": {} };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [cell.styles = x, y, height, width]', async (t) => {
    let input = { "styles": { "x": 1, "y": 2, "height": 3, "width": 4 } };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didDrawCell [cell = valid]', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 0,
        "y": 1,
        "width": 2,
        "height": 3
    };
    let expected = [[1, 1, 1, 4]];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didDrawCell [prevCell = object]', async (t) => {
    let input = {};
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell != object]', async (t) => {
    let input = '{}';
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell.text = array]', async (t) => {
    let input = { "text": ['Garbage'] };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell.text = 1/4 activity]', async (t) => {
    let input = { "text": ['Work'] };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell.text != array]', async (t) => {
    let input = { "text": 'Garbage' };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell.styles = object]', async (t) => {
    let input = { "styles": {} };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell.styles = x]', async (t) => {
    let input = { "styles": { "x": 1, "y": 2, "height": 3, "width": 4 } };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [prevCell = valid]', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 0,
        "y": 1,
        "width": 2,
        "height": 3
    };
    let expected = [[1, 1, 1, 4]];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didDrawCell [splitCellLines = array]', async (t) => {
    let input = [];
    let expected = [[1, 1, 1, 4]];

    let args = minimacroSplitCellLines(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [splitCellLines != array]', async (t) => {
    let input = '[]';
    let expected = input;

    let args = minimacroSplitCellLines(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didDrawCell [isSplitCell = true]', async (t) => {
    let input = true;
    let expected = [[1, 1, 1, 4]];

    let args = minimacroIsSplitCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [isSplitCell = truthy]', async (t) => {
    let input = 'true';
    let expected = [[1, 1, 1, 4]];

    let args = minimacroIsSplitCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didDrawCell [isSplitCell != true]', async (t) => {
    let input = false;
    let expected = [];

    let args = minimacroIsSplitCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------  _didParseCell ----------------------------- *|
|* -                       cell, prevCell, isSplitCell                      - *|
\* -------------------------------------------------------------------------- */


test.serial('_didParseCell [cell = object]', async (t) => {
    let input = {};
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell != object]', async (t) => {
    let input = '{}';
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell = undefined]', async (t) => {
    let input = undefined;
    let expected = undefined;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.text = array]', async (t) => {
    let input = { "text": ['Garbage'] };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.text = 1/4 activity]', async (t) => {
    let input = { "text": ['Work'] };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.text = "Private"]', async (t) => {
    let input = {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ['Private']
    };
    let expected = {
        "styles": { "fillColor": [118, 118, 118], "lineColor": 1, "lineWidth": 0.001, "textColor": [255, 255, 255] },
        "text": ['Private']
    };

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.text != array]', async (t) => {
    let input = { "text": 'Garbage' };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.styles = object]', async (t) => {
    let input = { "styles": {} };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.styles = color, width]', async (t) => {
    let input = { "styles": { "lineColor": 1, "lineWidth": 2 } };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell.styles != object]', async (t) => {
    let input = { "styles": 'Garbage' };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [cell = valid]', async (t) => {
    let input = {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ['Work']
    };
    let expected = {
        "styles": {
            "fillColor": 1,
            "halign": 'right',
            "lineColor": 1,
            "lineWidth": 0.001,
        },
        "text": [
            'Work',
        ]
    };

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didParseCell [prevCell = object]', async (t) => {
    let input = {};
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Level 6"]
    };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Level 6"]
     });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell != object]', async (t) => {
    let input = '{}';
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Level 7"]
    };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Level 7"]
     });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell = undefined]', async (t) => {
    let input = undefined;
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Level 8"]
    };
    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Level 8"]
     });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell.text = array]', async (t) => {
    let input = { "text": ['Garbage'] };
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Level 9"]
    };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Level 9"]
     });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell.text = 1/4 activity]', async (t) => {
    let input = { "text": ['Work'] };
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Level 10"]
    };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Level 10"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell.text != array]', async (t) => {
    let input = { "text": { "property": 'Garbage' } };
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Basics I"]
     };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Basics I"]
     });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [prevCell = valid]', async (t) => {
    let input = {
        "text": ['Work'],
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
    };
    let expected = {
        "styles": { "fillColor": 1, "lineColor": 1, "lineWidth": 0.001 },
        "text": ["Basics II"]
    };

    let args = minimacroPrevCell(input, {
        "styles": { "fillColor": 1, "lineColor": 2, "lineWidth": 3 },
        "text": ["Basics II"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test.serial('_didParseCell [isSplitCell = true]', async (t) => {
    let input = true;
    let expected = {
        "height": 3,
        "styles": {
            "fillColor": 1,
            "halign": 'right',
            "lineColor": 1,
            "lineWidth": 0.001,
        },
        "text": [
            'Work',
        ],
        "width": 2,
        "x": 0,
        "y": 1
    };

    let args = minimacroIsSplitCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [isSplitCell = truthy]', async (t) => {
    let input = 'true';
    let expected = {
        "height": 3,
        "styles": {
            "fillColor": 1,
            "halign": 'right',
            "lineColor": 1,
            "lineWidth": 0.001,
        },
        "text": [
            'Work',
        ],
        "width": 2,
        "x": 0,
        "y": 1
    };

    let args = minimacroIsSplitCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test.serial('_didParseCell [isSplitCell != true]', async (t) => {
    let input = false;
    let expected = {
        "height": 3,
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3,
        },
        "text": [
            'Work',
        ],
        "width": 2,
        "x": 0,
        "y": 1
    };

    let args = minimacroIsSplitCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});
