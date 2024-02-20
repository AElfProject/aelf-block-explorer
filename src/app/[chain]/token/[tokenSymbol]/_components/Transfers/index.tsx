'use client';
import Table from '@_components/Table';
import useTableData from '@_hooks/useTable';
import { useMobileContext } from '@app/pageProvider';
import { Descriptions, DescriptionsProps } from 'antd';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { fetchTransfersData } from '../../mock';
import { ITokenSearchProps, ITransferItem, ITransferTableData, SearchType, TTransferSearchData } from '../../type';
import getColumns from './columns';
import { getSearchByHashItems, getSearchByHolderItems } from './utils';
interface ITransfersProps extends ITokenSearchProps {
  SSRData: ITransferTableData;
}

const labelStyle: React.CSSProperties = {
  color: '#858585',
  fontSize: '10px',
  lineHeight: '18px',
};

const contentStyle: React.CSSProperties = {
  color: '#252525',
  fontSize: '14px',
  lineHeight: '22px',
};

export interface ITransfersRef {
  setSearchStr: (val: string) => void;
}

const Transfers = ({ SSRData, search, searchType, onSearchChange, onSearchInputChange }: ITransfersProps, ref) => {
  const { isMobileSSR: isMobile } = useMobileContext();
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [address, setAddress] = useState<string>('');
  const [searchData, setSearchData] = useState<TTransferSearchData>();

  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange, setSearchText } = useTableData<
    ITransferItem,
    ITransferTableData
  >({
    SSRData,
    defaultPageSize: 50,
    fetchData: fetchTransfersData,
    disposeData: (res: ITransferTableData) => {
      const { balance, value, list, total } = res;
      setSearchData({ balance, value });
      return { list, total };
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      setSearchStr(val: string) {
        setAddress(val);
        setSearchText(val);
      },
    }),
    [setSearchText],
  );

  const columns = useMemo(
    () =>
      getColumns({
        timeFormat,
        handleTimeChange: () => setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age'),
      }),
    [timeFormat],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  const searchByHolder: DescriptionsProps['items'] = useMemo(
    () => getSearchByHolderItems(address, isMobile, searchData),
    [address, isMobile, searchData],
  );
  const searchByHash: DescriptionsProps['items'] = useMemo(
    () => getSearchByHashItems(address, isMobile),
    [address, isMobile],
  );

  return (
    <div>
      {searchType !== SearchType.other && (
        <div className="mx-4 border-b border-b-[#e6e6e6] pb-4">
          {searchType === SearchType.address && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHolder}
            />
          )}
          {searchType === SearchType.txHash && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHash}
            />
          )}
        </div>
      )}
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        topSearchProps={{
          value: search || '',
          onChange: ({ currentTarget }) => {
            onSearchInputChange(currentTarget.value);
          },
          onSearchChange,
        }}
        showTopSearch
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
};

export default forwardRef<ITransfersRef, ITransfersProps>(Transfers);
