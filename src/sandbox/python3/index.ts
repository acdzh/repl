import './brython';
import REPLEngine from './engine';

const global = typeof window !== 'undefined' && window !== null ? window : self;

global.REPLEngine = REPLEngine;
