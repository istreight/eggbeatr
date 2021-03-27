const jsdom = require("jsdom");
const env = require('browser-env');

const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>');

env(['window', 'document', 'HTMLElement', 'HTMLCanvasElement']);

global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js',
};
