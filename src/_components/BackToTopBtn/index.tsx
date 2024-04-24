'use client';
import IconFont from '@_components/IconFont';
import animateScrollTo from 'animated-scroll-to';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import './index.css';
import { useThrottleFn } from 'ahooks';
const BACK_TO_TOP_HEIGHT = 40;
interface IProps {
  isDark: boolean;
}
const BackToTopButton = ({ isDark }: IProps) => {
  const [showButton, setShowButton] = useState(false);

  const { run: checkScrollHeight } = useThrottleFn(
    () => {
      const node = document?.querySelector('#scroll-content') as Element;
      if (!node) {
        return;
      }

      if (node.scrollTop > BACK_TO_TOP_HEIGHT) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );
  useEffect(() => {
    const node = document?.querySelector('#scroll-content') as Element;
    node?.addEventListener('scroll', checkScrollHeight);
    return () => {
      node?.removeEventListener('scroll', checkScrollHeight);
    };
  }, [checkScrollHeight]);

  const scrollToTop = () => {
    try {
      const node = document?.querySelector('#scroll-content') as Element;
      animateScrollTo(0, { speed: 100, elementToScroll: node });
    } catch (e) {
      throw new Error('dom not found');
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <div onClick={scrollToTop} className={clsx('back-to-top-container', isDark && 'back-to-top-main')}>
      <IconFont type="Backtotop" />
      <span className="text">Back to Top</span>
    </div>
  );
};

export default BackToTopButton;
