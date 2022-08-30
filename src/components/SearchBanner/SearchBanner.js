/**
 * @file SearchBanner.js
 * @author huangzongzhe
 */
import React, {
    Component
} from 'react';

import Search from '../Search/Search';
import './SearchBanner.less';

export default class SearchBanner extends Component {

    render() {
        return (
            <div className="search-banner-container">
                <div className="search-banner">
                    <h2 className="search-banner-text">AELF Explorer</h2>
                    <Search></Search>
                </div>
            </div>
        );
    }
}
