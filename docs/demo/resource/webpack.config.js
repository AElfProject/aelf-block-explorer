/**
 * @file webpack.config.js
 * @author zmh3788
 */

const path = require('path');

module.exports = {
    entry: './resource.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resource.bundle.js'
    }
};
