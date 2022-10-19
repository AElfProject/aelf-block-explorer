import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import Search from '../Home/components/Search';
import useMobile from 'hooks/useMobile';
import { useRouter } from 'next/router';
require('./SearchInvalid.styles.less');

const banner = require('assets/images/search_invalid.png');

function SearchInvalid() {
  const { pathname, query } = useRouter();
  const { string } = query;
  const isMobile = useMobile();
  return (
    <div className={clsx('basic-container-new search-invalid', isMobile && 'mobile')}>
      <img src={banner} alt="search not found" />
      <h3>Search not found !</h3>
      <p className="tip">
        Oops! The search string you entered was:{isMobile ? <br /> : ' '}
        <span>{string || pathname.replace('/search-invalid/', '')}</span>
      </p>
      <p className="warning">Sorry! This is an invalid search string.</p>
      <Search />
      <Link href="/" className="back-btn">
        <a className="back-btn">
          <IconFont type="right2" />
          Back Home
        </a>
      </Link>
    </div>
  );
}

export default SearchInvalid;
