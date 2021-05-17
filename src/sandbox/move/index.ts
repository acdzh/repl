import move from 'raw-loader!./move/dist/move-browser.js';

import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

// there is a move package on package.json
// and it run well on node
// but it use an ancient package: require, like kaffeine
// webpack can not pack it well.
// so i have to build a browser version manually.
global.eval.call(global, move);

global.REPLEngine = REPLEngine;
