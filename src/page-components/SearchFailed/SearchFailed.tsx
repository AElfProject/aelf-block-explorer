import React from 'react';
import IconFont from 'components/IconFont';
import useMobile from 'hooks/useMobile';
import { withRouter } from 'next/router';
import clsx from 'clsx';
import { Button } from 'antd';
const banner = require('assets/images/search_invalid.png');

require('./SearchFailed.styles.less');
function SearchFailed(props) {
  const isMobile = useMobile();
  const { router } = props;
  return (
    <div className={clsx('search-failed basic-container-new', isMobile && 'mobile')}>
      <img src={banner} alt="search failed" />
      <h3>Search failed !</h3>
      <p className="try-again">Please try again!</p>
      <Button type="link" className="back-btn" onClick={() => router.back()}>
        <IconFont type="Search" />
        Search Again
      </Button>
    </div>
  );
}
export default withRouter(SearchFailed);
