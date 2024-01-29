import { Button, Select } from 'antd';
import type { PaginationProps } from 'antd';
import './pagination.css';
import { useEffect, useMemo, useState } from 'react';
import IconFont from '@_components/IconFont';
import { useDebounceFn } from 'ahooks';
import clsx from 'clsx';

function JumpButton({ disabled, className, name, onChange }) {
  return (
    <Button
      type="primary"
      ghost
      disabled={disabled}
      className={className}
      onClick={onChange}
      icon={
        <IconFont className={clsx(disabled ? 'disabled-icon' : 'active-icon', 'w-3', 'h-3', 'text-xs')} type={name} />
      }></Button>
  );
}

export type Options = {
  value: number;
  label: number;
};

export interface IEpPaginationProps extends PaginationProps {
  current?: number;
  pageSize?: number;
  isMobile?: boolean;
  defaultCurrent?: number;
  total: number;
  defaultPageSize?: number;
  showSizeChanger?: boolean;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number) => void;
  options?: Options[];
}

export default function EpPagination({
  current,
  pageSize = 25,
  defaultCurrent = 1,
  defaultPageSize = 25,
  total,
  isMobile,
  showSizeChanger = true,
  pageChange,
  pageSizeChange,
  options = [
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ],
}: IEpPaginationProps) {
  const [pageNum, setPageNum] = useState<number>(defaultCurrent);
  const [pageSizeValue, setPageSizeValue] = useState<number>(defaultPageSize);

  useEffect(() => {
    current && setPageNum(current as number);
  }, [current]);
  useEffect(() => {
    pageSize && setPageSizeValue(pageSize);
  }, [pageSize]);

  const totalPage = useMemo(() => {
    return Math.floor((total + pageSize - 1) / pageSize);
  }, [total, pageSize]);

  const isFirstPage = useMemo(() => {
    return pageNum === 1;
  }, [pageNum]);

  const isLastPage = useMemo(() => {
    return pageNum === totalPage;
  }, [pageNum, totalPage]);

  const prevChange = () => {
    const page = pageNum === 1 ? pageNum : pageNum - 1;
    setPageNum(page);
    pageChange && pageChange(page);
  };

  const { run: runPrevChange } = useDebounceFn(prevChange, { wait: 300 });

  const nextChange = () => {
    const page = pageNum === totalPage ? totalPage : pageNum + 1;
    setPageNum(page);
    pageChange && pageChange(page);
  };
  const { run: runNextChange } = useDebounceFn(nextChange, { wait: 300 });

  const jumpFirst = () => {
    setPageNum(1);
    pageChange && pageChange(1, pageSize);
  };

  const { run: debounceJumpFirst } = useDebounceFn(jumpFirst, { wait: 300 });

  const jumpLast = () => {
    setPageNum(totalPage);
    pageChange && pageChange(totalPage, pageSize);
  };
  const { run: debounceJumpLast } = useDebounceFn(jumpLast, { wait: 300 });

  const sizeChange = (value) => {
    setPageNum(1);
    pageChange && pageChange(1, pageSize);
    setPageSizeValue(value);
    pageSizeChange && pageSizeChange(value);
  };

  return (
    <div className={clsx('ep-pagination', `ep-pagination-${isMobile ? 'mobile' : 'pc'}`)}>
      <div className="ep-pagination-left">
        {showSizeChanger && (
          <>
            <span className="title text-xs leading-5 text-base-100">Show：</span>
            <Select
              defaultValue={pageSizeValue}
              suffixIcon={<IconFont className="submenu-right-arrow" type="menu-down" />}
              options={options}
              onChange={sizeChange}
            />
            <span className="title text-xs leading-5 text-base-100">Records</span>
          </>
        )}
      </div>
      <div className="ep-pagination-right">
        <div className="pagination-first">
          <Button
            disabled={isFirstPage}
            type="primary"
            ghost
            className="!px-2 !text-xs !leading-5 mr-2 first-button"
            onClick={debounceJumpFirst}>
            First
          </Button>
        </div>
        <div className="pagination-prev w-8">
          <JumpButton disabled={isFirstPage} onChange={runPrevChange} className="prev" name="left-arrow" />
        </div>
        <div className="pagination-page">
          <div className="text-xs leading-5 text-base-200">{`Page ${current || pageNum} of ${totalPage}`}</div>
        </div>
        <div className="pagination-next">
          <JumpButton disabled={isLastPage} onChange={runNextChange} className="next" name="right-arrow" />
        </div>
        <div className="pagination-last">
          <Button
            disabled={isLastPage}
            type="primary"
            ghost
            className="!px-2 ml-2 !text-xs !leading-5 last-button"
            onClick={debounceJumpLast}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
