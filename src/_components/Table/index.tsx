import IconFont from '@_components/IconFont';
import { ITableProps, Pagination, Table } from 'aelf-design';
import { SpinProps } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import clsx from 'clsx';
import { ReactNode } from 'react';
import CommonEmpty from './empty';
import './index.css';

type HeaderTitleType = 'single' | 'multi';

export interface ICommonTableProps<T> extends ITableProps<T> {
  total: number;
  pageNum?: number;
  pageSize?: number;
  isMobile?: boolean;
  defaultCurrent?: number;
  className?: string;
  titleType: HeaderTitleType;
  singleTitle?: string;
  options?: any[];
  multiTitle?: string | boolean;
  multiTitleDesc?: string | boolean;
  order?: SortOrder | undefined | null;
  field?: string | null;
  loading?: boolean | SpinProps;
  emptyType?: 'nodata' | 'search' | 'internet' | ReactNode | (() => ReactNode) | null;
  emptyText?: string;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number) => void;
  emptyPic?: string;
  headerLeftNode?: ReactNode;
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
        <div className="total-text text-sm font-normal leading-22 text-base-100">{multiTitle}</div>
        <div className="bottom-text text-xs font-normal leading-5 text-base-200">{multiTitleDesc}</div>
      </>
    );
  } else {
    return (
      <div className="single align-center flex">
        {/* <iconpark-icon width="0.75rem" height="0.75rem" name="Rank"></iconpark-icon> */}
        <IconFont className="text-xs" type="Rank" />
        <div className="total-tex ml-1 text-sm font-normal leading-22  text-base-100 ">{singleTitle}</div>
      </div>
    );
  }
}

export default function TableApp({
  loading = false,
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
  options,
  titleType,
  emptyText,
  headerLeftNode,
  ...params
}: ICommonTableProps<any>) {
  return (
    <div className="ep-table rounded-lg bg-white shadow-table">
      <div className={clsx('ep-table-header p-4', `ep-table-header-${isMobile ? 'mobile' : 'pc'}`)}>
        <div className="header-left">
          <HeaderTitle
            singleTitle={singleTitle}
            multiTitleDesc={multiTitleDesc}
            multiTitle={multiTitle}
            titleType={titleType}
          />
          {headerLeftNode}
        </div>
        <div className="header-pagination">
          <Pagination
            current={pageNum}
            total={total}
            options={options}
            pageSize={pageSize}
            defaultPageSize={pageSize}
            defaultCurrent={defaultCurrent}
            showSizeChanger={false}
            pageChange={pageChange}
            pageSizeChange={pageSizeChange}
          />
        </div>
      </div>
      <Table
        loading={loading}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: emptyStatus({ emptyType, emptyText }),
        }}
        {...params}
      />
      <div className="p-4">
        <Pagination
          current={pageNum}
          options={options}
          defaultPageSize={pageSize}
          total={total}
          pageSize={pageSize}
          defaultCurrent={defaultCurrent}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}
        />
      </div>
    </div>
  );
}
