/* eslint-disable import/no-unresolved */
import kaffeine from 'raw-loader!./kaffeine.js';

import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.eval.call(global, kaffeine);

global.REPLEngine = REPLEngine;
