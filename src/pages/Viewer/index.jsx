/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './index.less';

async function innerHeight(time = 0, timeout = 500, maxTime = 10) {
    const currentTime = time + 1;
    if (currentTime > maxTime) {
        return '100vh';
    }
    try {
        const height =
            document.querySelector('#viewer').contentWindow.querySelector('#app').clientHeight;
        if (height && height > 400) {
            return `${height + 100}px`;
        }
        throw new Error('invalid');
    } catch (e) {
        await new Promise(resolve => {
           setTimeout(() => {
               resolve();
           }, timeout);
        });
        return innerHeight(currentTime);
    }
}



const Viewer = props => {
    const { url } = props;

    useEffect(() => {
        function listener(event) {
            const {
                data,
                origin
            } = event;
            console.log(origin);
            if (
                (origin === 'http://0.0.0.0:8526' && process.env.NODE_ENV !== 'production')
                || (origin === location.origin && process.env.NODE_ENV === 'production')) {
                console.log(data);
                const {
                    height
                } = data;
                if (height) {
                    document.querySelector('#viewer').style.height = height;
                }
            }
        }
        window.addEventListener('message', listener);
        return () => {
            window.removeEventListener('message', listener);
        };
    }, []);

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
    url: process.env.NODE_ENV === 'production' ? '/viewer/list.html' : 'http://0.0.0.0:8526/list.html'
};

module.exports = Viewer;
