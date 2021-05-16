const path = require('path');

const SANDBOX_PATH = path.resolve(__dirname, '.');

const p = (lang) => path.join(SANDBOX_PATH, lang, 'index.ts');

const langList = [
  'apl',
  'bloop',
  'brainfuck',
  'coffee-script',
  'emoticon',
];

const entryMap = {};

langList.forEach((lang) => {
  entryMap[lang] = p(lang);
});

module.exports = {
  sandboxEntryMap: entryMap,
};
