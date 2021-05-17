// eslint-disable-next-line import/no-webpack-loader-syntax
import bfloop from 'raw-loader!./bloop.js';
import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.eval.call(global, bfloop);

global.REPLEngine = REPLEngine;
