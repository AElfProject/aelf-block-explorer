import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { memo } from 'react';
import './index.css';

function EPSortIcon({ sortOrder }) {
  return (
    <div className="ep-sorter ant-table-column-sorter-inner">
      <IconFont className={clsx(sortOrder === 'ascend' && 'active', 'up-sorter')} type="sort-up" />
      <IconFont className={clsx(sortOrder === 'descend' && 'active', 'down-sorter')} type="sort-down" />
    </div>
  );
}

export default memo(EPSortIcon);
