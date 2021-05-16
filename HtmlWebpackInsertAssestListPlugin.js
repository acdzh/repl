/* eslint-disable */
// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { createHtmlTagObject } = HtmlWebpackPlugin;
const path = require('path');

const parseCompilationAssest = (assetNames, publicPath) => {
  const dic = {};
  assetNames.map((assetName) => {
    const a = assetName.split('.');
    return {
      name: a[0],
      fullName: assetName,
      src: publicPath + assetName,
      ext: path.extname(assetName),
    };
  }).forEach(a => {
    if (a.ext === '.js') {
      dic[a.name] = a;
    }
    dic[a.name + a.ext] = a;
  });
  return dic;
};

class HtmlWebpackInsertAssestListPlugin {
  apply(compiler) {
    const plugingName = 'HtmlWebpackInsertAssestListPlugin';
    compiler.hooks.compilation.tap(plugingName, (compilation) => {
      // console.log('The compiler is starting a new compilation...');

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        plugingName, // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
					const assestMap = parseCompilationAssest(Object.keys(compilation.assets), data.publicPath);
          const insertScript = `window.__SCRIPT_MAP__=${JSON.stringify(assestMap)};`;
					data.headTags.push(createHtmlTagObject('script', {}, insertScript));
          // console.log(JSON.stringify(data, null, 2));
          // Manipulate the content
          data.html += 'The Magic Footer';
          // Tell webpack to move on
          cb(null, data);
        },
      );
    });
  }
}

module.exports = HtmlWebpackInsertAssestListPlugin;
