/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';
import IFrame from '../../components/IFrame';
import {rand16Num} from "../../utils/utils";

const DEFAULT_URL = '/viewer/proposal.html#/proposals';

const Proposal = () => {

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
            setUrl(`${DEFAULT_URL}`);
        }
    }, [location.hash]);

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

export default Proposal;
