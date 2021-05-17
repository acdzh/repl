/* eslint-disable import/no-unresolved */
import  from 'raw-loader!./.js';

import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;
global.eval.call(global, );

global.REPLEngine = REPLEngine;
