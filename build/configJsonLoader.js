const fs = require('fs');
const path = require('path');
const { urlToRequest } = require('loader-utils');


module.exports = function (source) {
  const options = this.getOptions();
  const tdvw = options.tdvw;
  let configJsonPath = path.resolve(__dirname, '..', this.resourcePath);
  if (tdvw) {
    configJsonPath = configJsonPath.replace('config.json', 'config-tdvw.json');
    source = fs.readFileSync(configJsonPath, 'utf-8');
  }
  return `module.exports = ${source}`;
}
