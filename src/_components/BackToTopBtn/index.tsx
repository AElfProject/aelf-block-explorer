/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:00:17
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:00:58
 * @Description:
 */
import IconFont from '@_components/IconFont';
// import { Button } from 'antd';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import './index.css';
const BACK_TO_TOP_HEIGHT = 40;
interface IProps {
  isDark: boolean;
}
const BackToTopButton = ({ isDark }: IProps) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkScrollHeight = () => {
      if (!showButton && window.pageYOffset > BACK_TO_TOP_HEIGHT) {
        setShowButton(true);
      } else if (showButton && window.pageYOffset <= BACK_TO_TOP_HEIGHT) {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', checkScrollHeight);
    return () => {
      window.removeEventListener('scroll', checkScrollHeight);
    };
  }, [showButton]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div onClick={scrollToTop} className={clsx('back-to-top-contrainer', isDark ? 'back-to-top-main' : '')}>
      <IconFont type="Backtotop" />
      <span className="text">Back to Top</span>
    </div>
  );
};

export default BackToTopButton;
