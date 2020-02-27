/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';
import IFrame from '../../components/IFrame';
import './index.less';


// const DEFAULT_URL = process.env.NODE_ENV === 'production' ? '/viewer/list.html' : 'http://0.0.0.0:8526/list.html';

const DEFAULT_URL = '/viewer/list.html';

const Viewer = props => {

    const location = useLocation();
    const [url, setUrl] = useState(DEFAULT_URL);

    function onChange(href) {
        window.history.replaceState(
            window.history.state,
            '',
            `${location.origin}${location.pathname}?#${encodeURIComponent(href)}`);
    }

    useEffect(() => {
        const {
            hash
        } = location;
        if (hash) {
            console.log(decodeURIComponent(hash));
            setUrl(decodeURIComponent(hash).split('#')[1]);
        }
    }, []);

    useEffect(() => {
        const {
            hash
        } = location;
        if (!hash) {
            setUrl(DEFAULT_URL);
        }
    }, [location]);

    return (
        <div
            className="explorer-viewer-iframe"
        >
            <IFrame
                url={url}
                onChange={onChange}
            />
        </div>
    );
};

export default Viewer;
