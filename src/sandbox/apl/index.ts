import apl from 'raw-loader!./APL.js/JS/apl.js';
import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.eval.call(global, apl);

global.REPLEngine = REPLEngine;
