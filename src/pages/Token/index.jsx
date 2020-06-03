/**
 * @file contract viewer
 * @author atom-yang
 */
import React from 'react';
import IframeViewer from "../../components/IframeViewer";

const DEFAULT_URL = '/viewer/address.html#/token';

const Token = props => {
    return (
        <IframeViewer
            {...props}
            defaultUrl={DEFAULT_URL}
        />
    );
};

export default Token;
