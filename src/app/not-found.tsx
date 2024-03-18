'use client';
import IconFont from '@_components/IconFont';
import Image from 'next/image';
import Link from 'next/link';
import Logo from 'public/image/search-not-found-red.svg';

const NotFound = () => {
  return (
    <div className="not-found-wrap">
      <div className="not-found-logo-wrap">
        <Image className="object-contain" fill src={Logo} alt="" />
      </div>
      <h1 className="not-found-h1">Search not found!</h1>
      <h2 className="not-found-h2">Oops! The search string you entered was: xxx</h2>
      <h3 className="not-found-h3">
        <div className="not-found-icon">
          <IconFont type="Warning" />
        </div>
        This is an invalid search string!
      </h3>
      <Link className="not-found-btn" href="/">
        Back Home
      </Link>
    </div>
  );
};
export default NotFound;
