import React, { ReactNode } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd/es/table';
import './index.css';
import { SortOrder } from 'antd/es/table/interface';
import CommonEmpty from './empty';
import EpPagination from './pagination';
import IconFont from '@_components/IconFont';
import clsx from 'clsx';

type HeaderTitleType = 'single' | 'multi';

export interface ICommonTableProps<T> extends TableProps<T> {
  total: number;
  pageNum?: number;
  pageSize?: number;
  isMobile?: boolean;
  defaultCurrent?: number;
  className?: string;
  titleType: HeaderTitleType;
  singleTitle?: string;
  multiTitle?: string;
  multiTitleDesc?: string;
  order?: SortOrder | undefined | null;
  field?: string | null;
  loading?: boolean;
  emptyType?: 'nodata' | 'search' | 'internet' | ReactNode | (() => ReactNode) | null;
  emptyText?: string;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number) => void;
  emptyPic?: string;
}

export type EmptyType = 'nodata' | 'search' | 'internet';
function emptyStatus({ emptyType, emptyText }) {
  let type: EmptyType;
  if (!emptyType) {
    type = 'nodata';
  } else if (emptyType === 'nodata' || emptyType === 'search' || emptyType === 'internet') {
    type = emptyType;
  } else if (typeof emptyType === 'function') {
    return emptyType();
  } else {
    return emptyType;
  }
  return <CommonEmpty type={type} desc={emptyText} />;
}

function HeaderTitle({ titleType, singleTitle, multiTitle, multiTitleDesc }): ReactNode {
  if (titleType === 'multi') {
    return (
      <>
        <div className="total-text text-sm leading-22 font-normal text-base-100">{multiTitle}</div>
        <div className="bottom-text text-base-200 font-normal text-xs leading-5">{multiTitleDesc}</div>
      </>
    );
  } else {
    return (
      <div className="single flex align-center">
        {/* <iconpark-icon width="0.75rem" height="0.75rem" name="Rank"></iconpark-icon> */}
        <IconFont className="text-xs" type="Rank" />
        <div className="ml-1 total-tex text-sm leading-22 text-base-100  font-normal ">{singleTitle}</div>
      </div>
    );
  }
}

export default function TableApp({
  loading,
  pageNum,
  isMobile,
  pageSize,
  defaultCurrent,
  total,
  singleTitle,
  multiTitleDesc,
  multiTitle,
  pageChange,
  emptyType,
  pageSizeChange,
  titleType,
  emptyText,
  ...params
}: ICommonTableProps<any>) {
  return (
    <div className="ep-table bg-white rounded-lg shadow-table">
      <div className={clsx('ep-table-header p-4', `ep-table-header-${isMobile ? 'mobile' : 'pc'}`)}>
        <div className="header-left">
          <HeaderTitle
            singleTitle={singleTitle}
            multiTitleDesc={multiTitleDesc}
            multiTitle={multiTitle}
            titleType={titleType}
          />
        </div>
        <div className="header-pagination">
          <EpPagination
            current={pageNum}
            total={total}
            pageSize={pageSize}
            defaultValue={pageSize}
            defaultCurrent={defaultCurrent}
            showSizeChanger={false}
            pageChange={pageChange}
            pageSizeChange={pageSizeChange}
          />
        </div>
      </div>
      <Table
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        {...params}
        locale={{
          emptyText: emptyStatus({ emptyType, emptyText }),
        }}
      />
      <EpPagination
        current={pageNum}
        isMobile={isMobile}
        defaultValue={pageSize}
        total={total}
        pageSize={pageSize}
        defaultCurrent={defaultCurrent}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
