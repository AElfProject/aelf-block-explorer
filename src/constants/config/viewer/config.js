/* eslint-disable global-require */
let queriedConfig =
  process.env.CHAIN_ID === 'AELF' ? require('../../platform/AELF').default : require('../../platform/tDVW').default;
// only used in client
if (typeof window !== 'undefined') {
  const host = location.host;
  if (host.includes('tdvw') || host.includes('side02')) {
    queriedConfig = require('../../platform/tDVW').default;
  } else {
    queriedConfig = require('../../platform/AELF').default;
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
