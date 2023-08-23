import { Button, Select } from 'antd';
import type { PaginationProps } from 'antd';
import './pagination.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import IconFont from '@_components/IconFont';
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
  defaultValue?: number;
  showSizeChanger?: boolean;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number) => void;
  options?: Options[];
}

export default function EpPagination({
  current,
  pageSize = 25,
  defaultCurrent = 1,
  defaultValue = 25,
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
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSizeValue, setPageSizeValue] = useState<number>(defaultValue);
  useEffect(() => {
    setPageNum(pageNum);
  }, [defaultCurrent]);
  useEffect(() => {
    if (pageNum === current) return;
    setPageNum(current as number);
  }, [current]);
  useEffect(() => {
    if (pageSizeValue === pageSize) return;
    setPageSizeValue(pageSize);
  }, [pageSize]);

  const pageNumRef = useRef<any>(null);
  useEffect(() => {
    pageNumRef.current = pageNum;
  }, [pageNum]);
  const pageSizeRef = useRef<any>(null);
  useEffect(() => {
    pageSizeRef.current = pageSizeValue;
  }, [pageSizeValue]);

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
    console.log(pageNum, pageSize);
    if (pageNum === 1) {
      pageNumRef.current = 1;
    } else {
      pageNumRef.current = pageNum - 1;
    }
    setPageNum(pageNumRef.current);
    pageChange && pageChange(pageNumRef.current);
  };

  const nextChange = () => {
    if (pageNum === totalPage) {
      pageNumRef.current = totalPage;
    } else {
      pageNumRef.current = pageNum + 1;
    }
    setPageNum(pageNumRef.current);
    pageChange && pageChange(pageNumRef.current);
  };

  const jumpFirst = () => {
    pageNumRef.current = 1;
    setPageNum(pageNumRef.current);
    pageChange && pageChange(pageNumRef.current, pageSize);
  };

  const jumpLast = () => {
    pageNumRef.current = totalPage;
    setPageNum(pageNumRef.current);
    pageChange && pageChange(pageNumRef.current, pageSize);
  };

  const sizeChange = (value) => {
    pageNumRef.current = 1;
    setPageNum(pageNumRef.current);
    pageChange && pageChange(pageNumRef.current, pageSize);
    pageSizeRef.current = value;
    setPageSizeValue(pageSizeRef.current);
    pageSizeChange && pageSizeChange(pageSizeRef.current);
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
            className="px-2 text-xs leading-5 mr-2 first-button"
            onClick={jumpFirst}>
            First
          </Button>
        </div>
        <div className="pagination-prev w-8">
          <JumpButton disabled={isFirstPage} onChange={prevChange} className="prev" name="left-arrow" />
        </div>
        <div className="pagination-page">
          <div className="text-xs leading-5 text-base-200">{`Page ${current || pageNum} of ${totalPage}`}</div>
        </div>
        <div className="pagination-next">
          <JumpButton disabled={isLastPage} onChange={nextChange} className="next" name="right-arrow" />
        </div>
        <div className="pagination-last">
          <Button
            disabled={isLastPage}
            type="primary"
            ghost
            className="px-2 ml-2 text-xs leading-5 last-button"
            onClick={jumpLast}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
