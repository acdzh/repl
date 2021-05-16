import Coffeescript from 'raw-loader!./coffee-script.js';
import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.eval.call(global, Coffeescript);

global.REPLEngine = REPLEngine;
