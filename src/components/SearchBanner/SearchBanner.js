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
                    <h2 className="search-banner-text">AElf Scan</h2>
                    <h3 className="search-banner-text">Everyone contribute to building a harmonious society</h3>
                    <Search></Search>
                </div>
            </div>
        );
    }
}
