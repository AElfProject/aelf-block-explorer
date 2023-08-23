/*
 * @author: Peterbjx
 * @Date: 2023-08-18 10:55:28
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 11:23:44
 * @Description: jump button
 */

import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import './index.css';

export const enum JumpTypes {
  Prev = 'prev',
  Next = 'next',
}

export interface IJumpProps {
  isFirst: boolean;
  isLast?: boolean;
  jump: any;
}

export default function JumpButton({ isFirst, isLast, jump }: IJumpProps) {
  return (
    <div className="jump-link flex items-center">
      <div
        className={clsx('jum-button', isFirst && 'disabled-button')}
        onClick={() => {
          !isFirst && jump(JumpTypes.Prev);
        }}>
        <IconFont
          className={clsx(isFirst ? 'disabled-icon' : 'active-icon', 'w-3', 'h-3', 'text-xs')}
          type="left-arrow"
        />
      </div>
      <div
        className={clsx('jum-button ml-1', isLast && 'disabled-button')}
        onClick={() => {
          !isLast && jump(JumpTypes.Next);
        }}>
        <IconFont
          className={clsx(isLast ? 'disabled-icon' : 'active-icon', 'w-3', 'h-3', 'text-xs')}
          type="right-arrow"
        />
      </div>
    </div>
  );
}
