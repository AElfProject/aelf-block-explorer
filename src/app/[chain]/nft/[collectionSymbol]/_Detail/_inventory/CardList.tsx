import React, { ReactNode } from 'react';
import { Card, SpinProps, Spin } from 'antd';
// import './index.css';
import { SortOrder } from 'antd/es/table/interface';
import CommonEmpty from '@_components/Table/empty';
import IconFont from '@_components/IconFont';
import { Pagination, ITableProps } from 'aelf-design';
import EPSearch from '@_components/EPSearch';
import clsx from 'clsx';
import { ISearchProps } from 'aelf-design';
import { isReactNode } from '@_utils/typeUtils';
import { InventoryItem } from '../type';
import { ITableSearch } from '@_components/Table';

const { Meta } = Card;

export interface IHeaderTitleProps {
  single?: {
    title: string;
  };
  multi?: {
    title: string;
    desc: string | boolean;
  };
}

export interface Props {
  dataSource: InventoryItem[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  isMobile?: boolean;
  showTopSearch?: boolean;
  headerTitle?: IHeaderTitleProps | ReactNode;
  defaultCurrent?: number;
  className?: string;
  topSearchProps?: ITableSearch;
  loading?: boolean;
  emptyType?: 'nodata' | 'search' | 'internet' | ReactNode | (() => ReactNode) | null;
  emptyText?: string;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number, size: number) => void;
  headerLeftNode?: ReactNode;
  options?: any;
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
interface NftCardListProps {
  list: InventoryItem[];
}
function NftCardList(props: NftCardListProps) {
  const { list } = props;
  return (
    <div className="collection-detail-inventory row-cols-mobile-1 row-cols-2   row-cols-md-4 row-cols-lg-4 row-cols-xl-6">
      {list.map((itemObj, index) => {
        return (
          <div key={index} className="collection-detail-inventory-item">
            <Card
              hoverable
              cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              <div>
                <span>Symbol:</span>
                <span>{itemObj.item.symbol}</span>
              </div>
              <div>
                <span>Last Sale:</span>
                <span>
                  {itemObj.lastSalePriceInUsd}/{itemObj.lastSaleAmount}
                </span>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
const MemoNftCardList = React.memo(NftCardList);
function HeaderTitle(props: IHeaderTitleProps): ReactNode {
  if (props.multi) {
    return (
      <>
        <div className="total-text text-sm font-normal leading-22 text-base-100">{props.multi.title}</div>
        <div className="bottom-text text-xs font-normal leading-5 text-base-200">{props.multi.desc}</div>
      </>
    );
  } else {
    return (
      <div className="single align-center flex">
        <IconFont className="text-xs" type="Rank" />
        <div className="total-tex ml-1 text-sm font-normal leading-22  text-base-100 ">{props.single?.title}</div>
      </div>
    );
  }
}

export default function CardList({
  loading = false,
  pageNum,
  isMobile,
  pageSize,
  defaultCurrent,
  total,
  showTopSearch,
  topSearchProps,
  pageChange,
  emptyType,
  pageSizeChange,
  options,
  headerTitle,
  emptyText,
  headerLeftNode,
  dataSource,
  ...params
}: Props) {
  return (
    <Spin spinning={loading}>
      <div className="ep-table rounded-lg bg-white shadow-table">
        <div
          className={clsx(
            'ep-table-header',
            showTopSearch ? 'py-4' : 'p-4',
            `ep-table-header-${isMobile ? 'mobile' : 'pc'}`,
          )}>
          <div className="header-left">
            {isReactNode(headerTitle) ? headerTitle : <HeaderTitle {...headerTitle} />}
            {headerLeftNode}
          </div>
          <div className="header-pagination">
            {showTopSearch ? (
              <EPSearch
                {...topSearchProps}
                onPressEnter={({ currentTarget }) => {
                  topSearchProps?.onSearchChange(currentTarget.value);
                  topSearchProps?.onPressEnter?.(currentTarget.value);
                }}
                onClear={() => {
                  topSearchProps?.onSearchChange('');
                  topSearchProps?.onClear?.();
                }}
              />
            ) : (
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
            )}
          </div>
        </div>
        <MemoNftCardList list={dataSource} />
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
    </Spin>
  );
}
