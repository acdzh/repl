const path = require('path');
const fs = require('fs');

const BASE_PATH = path.resolve(__dirname, 'brython');

const fileNameList = fs.readdirSync(BASE_PATH);

let content = '';
let content2 = '\n\n';
fileNameList.forEach((name, index) => {
  if(path.extname(name) === '.js') {
    content += `import brython_${index} from '!!raw-loader!./brython/${name}';\n`;
    content2 += `global.eval.call(global, brython_${index});\n`;
  }
});

fs.writeFileSync(path.resolve(__dirname, 'brython.ts'), content + content2);