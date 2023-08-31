/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:00:17
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 10:37:04
 * @Description: title
 */
import clsx from 'clsx';
import React from 'react';
export default function HeadTitle({
  content,
  children,
  className,
}: {
  content: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(className, 'py-5 header-title flex items-end bg-inherit')}>
      <div className="text-xl font-bold not-italic text-base-100">{content}</div>
      {children}
    </div>
  );
}
