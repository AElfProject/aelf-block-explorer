/**
 * @file 打包工具
 * @author atom-yang
 */
/* eslint-env node */

const path = require('path');
const fs = require('fs');

const config = {
  outputPath: '/',
  // outputPath: '/viewer/static/'
};

const isProdMode = process.env.NODE_ENV === 'production';

const ROOT = path.resolve(__dirname, '..');

const PUBLIC_PATH = isProdMode ? config.outputPath : '/';

const OUTPUT_PATH = path.resolve(__dirname, '..', 'dist/');

const getLessVariables = (file) => {
  const themeContent = fs.readFileSync(file, 'utf-8');
  const variables = {};
  themeContent.split('\n').forEach((item) => {
    if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
      return;
    }
    const _pair = item.split(':');
    if (_pair.length < 2) return;
    const key = _pair[0].replace('\r', '').replace('@', '');
    if (!key) return;
    const value = _pair[1]
      .replace(';', '')
      .replace('\r', '')
      .replace(/^\s+|\s+$/g, '');
    variables[key] = value;
  });
  return variables;
};

// const PAGES = glob.sync("src/pages/*/index.jsx").map((page) => {
//   const name = page.slice(4, -10).replace(/\//g, "-").toLowerCase();
//   const paths = path.join(ROOT, page);
//   const dirName = path.dirname(paths);
//   const pageConfig = JSON.parse(
//     fs.readFileSync(path.resolve(dirName, "./config.json")).toString()
//   );
//   return {
//     origin: page,
//     path: paths,
//     config: pageConfig,
//     name,
//   };
// });

// const ENTRIES = PAGES.reduce((entries, page) => {
//   // eslint-disable-next-line no-param-reassign
//   entries[page.name] = path.resolve(ROOT, page.origin);
//   return entries;
// }, {});

module.exports = {
  ROOT,
  // PAGES,
  PUBLIC_PATH,
  OUTPUT_PATH,
  isProdMode,
  // ENTRIES
  getLessVariables,
};
