/* eslint-disable import/no-unresolved */
import python2 from '!!raw-loader!./Empythoned/python.js';

import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;
global.eval.call(global, python2);
global.REPLEngine = REPLEngine;
