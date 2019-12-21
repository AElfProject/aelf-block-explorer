/**
 * @file contract viewer
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

const Viewer = props => {
    const { url } = props;

    return (
        <div
            className="explorer-viewer-iframe"
        >
            <iframe
                id="viewer"
                name="viewer"
                src={url}
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                align="middle"
                scrolling="auto"
            />
        </div>
    );
};

Viewer.propTypes = {
    url: PropTypes.string
};

Viewer.defaultProps = {
    url: process.env.NODE_ENV === 'production' ? '/viewer/list.html' : 'http://192.168.199.128:8526/list.html'
};

module.exports = Viewer;
