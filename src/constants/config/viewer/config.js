/* eslint-disable global-require */
let queriedConfig =
  process.env.CHAIN_ID === 'AELF' ? require('../../platform/AELF').default : require('../../platform/tDVW').default;
let config = {};

if (process.env.NODE_ENV === 'production') {
  config = require('./config.prod.json');
} else {
  config = require('./config.dev.json');
}

module.exports = {
  ...queriedConfig,
  ...config,
};
