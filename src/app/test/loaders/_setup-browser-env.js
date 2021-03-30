const jsdom = require("jsdom");
const env = require('browser-env');

const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');

env(['HTMLElement', 'HTMLCanvasElement']);

global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js',
};
