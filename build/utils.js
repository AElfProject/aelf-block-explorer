/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-19 21:15:55
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-19 21:22:35
 * @Description: file content
 */
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');

const config = require('./config');

const isProdMode = process.env.NODE_ENV === 'production';

const ROOT = path.resolve(__dirname, '..');

const PUBLIC_PATH = isProdMode ? config.outputPath : '/';

const OUTPUT_PATH = path.resolve(__dirname, '..', 'dist/');

const getLessVariables = file => {
  const themeContent = fs.readFileSync(file, 'utf-8');
  const variables = {};
  themeContent.split('\n').forEach(item => {
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

module.exports = {
  ROOT,
  PUBLIC_PATH,
  OUTPUT_PATH,
  isProdMode,
  getLessVariables
};
