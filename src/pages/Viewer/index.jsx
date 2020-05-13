/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';
import IFrame from '../../components/IFrame';
import {
    rand16Num
} from '../../utils/utils';
import './index.less';

const DEFAULT_URL = '/viewer/address.html#/contract';

const Viewer = props => {
    const {
        match
    } = props
    const {
        address = ''
    } = match.params;


    const location = useLocation();
    const [url, setUrl] = useState('');

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
            setUrl(decodeURIComponent(hash).substring(1));
        } else {
            let newUrl = `${DEFAULT_URL}?random=${rand16Num(8)}`;
            if (address) {
                newUrl = `${DEFAULT_URL}/${address}?address=${address}`;
            }
            setUrl(newUrl);
        }
    }, [
        location.hash
    ]);

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
