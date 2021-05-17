import jsforth from 'raw-loader!./jsforth.js';
import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.eval.call(global, jsforth);

global.REPLEngine = REPLEngine;
