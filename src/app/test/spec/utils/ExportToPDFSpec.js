/**
 * FILENAME:    ExportToPDFSpec.js
 * AUTHOR:      Isaac Streight
 * START DATE:  March 26th, 2021
 *
 * This file contains the test specification for the ExportToPDF utility class.
 */

import test from 'ava';
import sinon from 'sinon';

import ExportToPDF from '@utils/ExportToPDF.js';

const e = new ExportToPDF();

test.before(() => {});

test.beforeEach(() => {});

test.afterEach.always(() => {});

test.after.always(() => {});



/* ========================================================================== *\
|*                                                                            *|
|*                                  MACROS                                    *|
|*                                                                            *|
\* ========================================================================== */



async function macroDidDrawPage({
    t,
    expected,
    data = {},
    setTitle = ''
}) {
    let res = e._didDrawPage(data, setTitle);

    if (data.doc && data.doc.text) {
        t.assert(data.doc.text.calledWith("Grid - " + setTitle), 'PDF includes unexpected title text');
        t.is(data.doc.text.callCount, 1);
    }

    t.deepEqual(res, expected, '_didDrawPage returned an unexpected value');
}

async function macroDrawLines({
    t,
    expected,
    doc = {},
    lineCoordinates = [],
    tableCoordinates = []
}) {
    let res = e._drawLines(doc, lineCoordinates, tableCoordinates);

    let isValidDoc = (Object.keys(doc) > 0) &&
        Object.keys(doc).every((e) => ['line', 'setDrawColor', 'setLineWidth'].includes(e) &&
            (typeof doc[e] === 'function')
        );

    if (doc && isValidDoc) {
        t.is(doc.line.callCount, expected, 'doc.line was called an unexpected number of times');
        t.is(doc.setDrawColor.callCount, Math.min(expected, 1), 'doc.setDrawColor was called an unexpected number of times');
        t.is(doc.setLineWidth.callCount, Math.min(expected, 1), 'doc.setLineWidth was called an unexpected number of times');
    }

    t.deepEqual(res, undefined, '_drawLines returned an unexpected value');
}

async function macroDidDrawCell({
    t,
    expected,
    cell = {},
    prevCell = {},
    splitCellLines = [],
    isSplitCell = true
}) {
    let res = e._didDrawCell(cell, prevCell, splitCellLines, isSplitCell);

    t.deepEqual(res, expected, '_didDrawCell returned an unexpected value');
}

async function macroDidParseCell({
    t,
    expected,
    cell,
    prevCell = {},
    isSplitCell = true
}) {
    let res = e._didParseCell(cell, prevCell, isSplitCell);

    t.deepEqual(res, expected, '_didParseCell returned an unexpected value');
}

async function macroSnapshot(t) {
    // Return base64 string, instead of displaying PDF.
    e.setPDFOutput('dataurlstring');

    // TODO: This is definitely something to be improved.
    // The base64 string returned by 'doc.output' varies slightly with the same input (~80 bits) each export, with the earliest variation around 8000th byte (discovered experimentally).
    // Differences across different inputs vary much sooner and in much greater quantity.
    // In addition, multiple snapshots will not function alongside webpack bundling.
    let pdf = e.pdf('Test Grid');
    t.snapshot(pdf.slice(0, 8100), 'Snapshot did not match stored value');
}



/* ========================================================================== *\
|*                                                                            *|
|*                              MINI MACROS                                   *|
|*       Mini-macros set up similar tests, but don't run any assertions       *|
\* ========================================================================== */



function minimacroCell(input) {
    return {
        "cell": input,
        "prevCell": {
            "text": ["Strokes"]
        }
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
            "styles": {
                "fillColor": 1,
                "lineColor": 2,
                "lineWidth": 3
            }
        },
        "isSplitCell": input,
        "prevCell": {
            "text": ["Strokes"]
        }
    };
}

function minimacroLineCoordinates(input) {
    return {
        "doc": {
            "line": sinon.stub(),
            "setDrawColor": sinon.stub(),
            "setLineWidth": sinon.stub()
        },
        "tableCoordinates": [0, 0, 0, 0],
        "lineCoordinates": input
    };
}

function minimacroPrevCell(input, c = {
    "text": ["Strokes"]
}) {
    return {
        "cell": c,
        "prevCell": input
    };
}

function minimacroSetTitle(input) {
    return {
        "data": {
            "doc": {
                "text": sinon.stub().returnsArg(0)
            },
            "cursor": {},
            "settings": {}
        },
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
        "prevCell": {
            "text": ["Strokes"]
        }
    };
}

function minimacroTableCoordinates(input) {
    return {
        "doc": {
            "line": sinon.stub(),
            "setDrawColor": sinon.stub(),
            "setLineWidth": sinon.stub()
        },
        "tableCoordinates": input
    };
}



/* ========================================================================== *\
|*                                                                            *|
|*                                  TESTS                                     *|
|*                                                                            *|
\* ========================================================================== */


/* -------------------------------------------------------------------------- *\
|* -----------------------------    snapshot    ----------------------------- *|
|* -                                                                        - *|
\* -------------------------------------------------------------------------- */

test.skip('[pdf] is executed fully', async (t) => {
    document.body.innerHTML = `
    <div id="dynamicGrid">
    <div class="modal">
    <div class="pure-menu-link">
        <div id="dynamicGrid" class="modal pure-menu-link">
            <table class="pure-table">
                <thead>
                    <tr>
                        <th>Instructor</th>
                        <th>9:00</th>
                        <th>9:30</th>
                        <th>10:00</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-odd">
                        <td class="first-column">Alfa</td>
                        <td class="privates-cell no-border is-left">Private</td>
                        <td class="">Basics I</td>
                        <td class="no-border">
                            <div class="line line-right">
                                <p>Work</p>
                            </div>
                        </td>
                    </tr>
                    <tr class="table-even">
                        <td class="first-column">Beta</td>
                        <td class="">Starfish</td>
                        <td class="privates-cell no-border is-left">Private</td>
                        <td class="">Sea Otter</td>
                    </tr>
                    <tr class="table-odd">
                        <td class="first-column">Charlie</td>
                        <td class="">Level 6</td>
                        <td class="no-border">
                            <div class="line line-right">
                                <p>Work</p>
                            </div>
                        </td>
                        <td class="privates-cell no-border is-left">Private</td>
                    </tr>
                </tbody>
            </table>
            </div>
            </div>
        </div>
    `;

    t.log('snapshot = 90% match');
    await macroSnapshot(t);
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------  setPDFOutput  ----------------------------- *|
|* -                                 output                                 - *|
\* -------------------------------------------------------------------------- */

test('[setPDFOutput] is executed fully', async (t) => {
    let input = 'Output';
    let expected = 'Output';

    e.setPDFOutput(input);
    t.is(e._pdfOutput, expected);
});


/* -------------------------------------------------------------------------- *\
|* -----------------------------  _didDrawPage  ----------------------------- *|
|* -                             data, setTitle                             - *|
\* -------------------------------------------------------------------------- */

test('[_didDrawPage] is short circuit when data is an empty object', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawPage] is short circuit when data is not an object', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawPage] is executed fully when data contains valid sub-key values', async (t) => {
    let input = {
        "doc": {
            "text": sinon.stub()
        },
        "cursor": {
            "x": 1,
            "y": 1
        },
        "settings": {
            "startY": 1
        }
    };
    let expected = [1, 1, 1, 1];

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawPage] is short circuit when data does not contains valid sub-key values', async (t) => {
    let input = {
        "doc": {},
        "cursor": {},
        "settings": {}
    };
    let expected = undefined;

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawPage] is executed fully when data only contains a valid value for "text"', async (t) => {
    let input = {
        "doc": {
            "text": sinon.stub()
        },
        "cursor": {},
        "settings": {}
    };
    let expected = [undefined, undefined, undefined, undefined];

    let args = minimacroData(input);
    macroDidDrawPage({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawPage] is executed fully with a Set title set', async (t) => {
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

test('[_drawLines] is short circuit when doc is an empty object', async (t) => {
    let input = {};
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when doc is not an object', async (t) => {
    let input = '{}';
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is executed fully when doc contains valid keys with functions as values', async (t) => {
    let input = {
        "line": sinon.stub(),
        "setDrawColor": sinon.stub(),
        "setLineWidth": sinon.stub()
    };
    let expected = 2;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when doc contains valid keys without functions as values', async (t) => {
    let input = {
        "line": '() => null',
        "setDrawColor": '() => null',
        "setLineWidth": '() => null'
    };
    let expected = undefined;

    let args = minimacroDoc(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_drawLines] is short circuit when tableCoordinates is undefined', async (t) => {
    let input = undefined;
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when tableCoordinates is an empty array', async (t) => {
    let input = [];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when tableCoordinates has fewer than 4 elements', async (t) => {
    let input = [0, 1, 2];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is executed fully when tableCoordinates has exactly 4 elements', async (t) => {
    let input = [0, 1, 2, 3];
    let expected = 2;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when tableCoordinates contains an elements that cannot be cast as numbers', async (t) => {
    let input = [0, '1', [], {}];
    let expected = 0;

    let args = minimacroTableCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_drawLines] is short circuit when lineCoordinates is an empty array', async (t) => {
    let input = [];
    let expected = 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is executed fully when lineCoordinates is a non-empty array', async (t) => {
    let input = [
        [0, 1, 2, 3],
        [4, 5, 6, 7]
    ];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when lineCoordinates contains a subarray with a length not equal to 4', async (t) => {
    let input = [
        [0, 1, 2],
        [4, 5, 6, 7]
    ];
    let expected = 3; // tableCoordinates: 2, valid inputs: 1

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is executed fully when lineCoordinates contains only 4-length subarrays', async (t) => {
    let input = [
        [0, 1, 2, 3]
    ];
    let expected = input.length + 2;

    let args = minimacroLineCoordinates(input);
    macroDrawLines({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_drawLines] is short circuit when lineCoordinates contains a subarray with elements that cannot be cast as numbers', async (t) => {
    let input = [
        [0, '1', [], {}]
    ];
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


test('[_didDrawCell] is short circuit when cell is an empty object', async (t) => {
    let input = {};
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when cell is not an object', async (t) => {
    let input = '{}';
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when cell includes the key "text" with an invalid value', async (t) => {
    let input = {
        "text": 'Garbage'
    };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when cell only includes the key "text" with a valid value', async (t) => {
    let input = {
        "text": ['Work']
    };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawCell] is short circuit when cell does not include the key "text"', async (t) => {
    let input = {
        "x": 1,
        "y": 2,
        "height": 3,
        "width": 4
    };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is executed fully when cell contains values that can be cast as numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": '0',
        "y": '1',
        "width": '2',
        "height": '3'
    };
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when cell contains values that cannot be cast as numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 'a',
        "y": [],
        "width": {},
        "height": null
    };
    let expected = [];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawCell] is executed fully when cell contains values that are numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 0,
        "y": 1,
        "width": 2,
        "height": 3
    };
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawCell] is short circuit when prevCell is an empty object', async (t) => {
    let input = {};
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when prevCell is not an object', async (t) => {
    let input = '{}';
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when prevCell includes the key "text" with an invalid value', async (t) => {
    let input = {
        "text": 'Garbage'
    };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when prevCell only includes the key "text" with a valid value', async (t) => {
    let input = {
        "text": ['Work']
    };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when prevCell does not include the key "text"', async (t) => {
    let input = {
        "x": 1,
        "y": 2,
        "height": 3,
        "width": 4
    };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is executed fully when prevCell contains values that can be cast as numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": '0',
        "y": '1',
        "width": '2',
        "height": '3'
    };
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when prevCell contains values that cannot be cast as numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 'a',
        "y": [],
        "width": {},
        "height": null
    };
    let expected = [];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is executed fully when prevCell contains values that are numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "text": ['Work'],
        "x": 0,
        "y": 1,
        "width": 2,
        "height": 3
    };
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroPrevCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawCell] is exectued fully when splitCellLines is an empty array', async (t) => {
    let input = [];
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroSplitCellLines(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is short circuit when splitCellLines is not an array', async (t) => {
    let input = '[]';
    let expected = input;

    let args = minimacroSplitCellLines(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didDrawCell] is executed fully when isSplitCell is true', async (t) => {
    let input = true;
    let expected = [
        [1, 1, 1, 4]
    ];

    let args = minimacroIsSplitCell(input);
    macroDidDrawCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didDrawCell] is executed fully when isSplitCell is not true', async (t) => {
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


test('[_didParseCell] is short circuit when cell is an empty object', async (t) => {
    let input = {};
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell is not an object', async (t) => {
    let input = '{}';
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell is undefined', async (t) => {
    let input = undefined;
    let expected = undefined;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell includes the key "text" with an invalid value', async (t) => {
    let input = {
        "text": 'Garbage'
    };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell only includes the key "text" with a valid value', async (t) => {
    let input = {
        "text": ['Work']
    };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is exectued fully when cell contains the key "text" paired with the value "Private"', async (t) => {
    let input = {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ['Private']
    };
    let expected = {
        "styles": {
            "fillColor": [118, 118, 118],
            "lineColor": 1,
            "lineWidth": 0.001,
            "textColor": [255, 255, 255]
        },
        "text": ['Private']
    };

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell does not include the key "text"', async (t) => {
    let input = {
        "styles": {
            "lineColor": 1,
            "lineWidth": 2
        }
    };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when cell includes the key "styles" paired with an invalid value', async (t) => {
    let input = {
        "styles": 'Garbage'
    };
    let expected = input;

    let args = minimacroCell(input);
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is executed fully when cell contains values that are numbers and the key "text" is paired with a valid value', async (t) => {
    let input = {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
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


test('[_didParseCell] is short circuit when prevCell is an empty object', async (t) => {
    let input = {};
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Level 6"]
    };

    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Level 6"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when prevCell is not an object', async (t) => {
    let input = '{}';
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Level 7"]
    };

    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Level 7"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when prevCell is undefined', async (t) => {
    let input = undefined;
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Level 8"]
    };
    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Level 8"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when prevCell includes the key "text" with an invalid value', async (t) => {
    let input = {
        "text": 'Garbage'
    };
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Level 9"]
    };

    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Level 9"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is short circuit when prevCell only includes the key "text" with a valid value', async (t) => {
    let input = {
        "text": ['Work']
    };
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Level 10"]
    };

    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Level 10"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});

test('[_didParseCell] is exectued fully when cell contains valid values', async (t) => {
    let input = {
        "text": ['Work'],
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
    };
    let expected = {
        "styles": {
            "fillColor": 1,
            "lineColor": 1,
            "lineWidth": 0.001
        },
        "text": ["Basics II"]
    };

    let args = minimacroPrevCell(input, {
        "styles": {
            "fillColor": 1,
            "lineColor": 2,
            "lineWidth": 3
        },
        "text": ["Basics II"]
    });
    macroDidParseCell({
        "t": t,
        "expected": expected,
        ...args
    });
});


test('[_didParseCell] is executed fully when isSplitCell is true', async (t) => {
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

test('[_didParseCell] is short citcuit when isSplitCell is not true', async (t) => {
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
