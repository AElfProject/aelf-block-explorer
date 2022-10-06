/* eslint-disable global-require */
const queriedConfig = require('../../platform/AELF').default;
if (typeof window !== 'undefined') {
  const host = location.host;
  if (host.includes('tDVW')) {
    config = require('../../platform/tDVW').default;
  }
}

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
