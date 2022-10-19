import { Select, SelectProps } from 'antd';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import React from 'react';
import styles from './styles.module.less';
export default function CommonSelect({ className, popupClassName, ...props }: any) {
  return (
    <Select
      clearIcon={<IconFont onClick={(e) => e.stopPropagation()} type="ErrorClose" />}
      suffixIcon={<IconFont className="pointer-events-none" type="Search" />}
      getPopupContainer={(triggerNode) => triggerNode}
      popupClassName={clsx(styles['select-dropdown'], popupClassName)}
      className={clsx(styles.select, className)}
      {...props}
    />
  );
}
