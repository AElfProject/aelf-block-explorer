'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from '@_components/TokenTransfers/columnConfig';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { TokenTransfersItemType } from '@_types/commonDetail';
import fetchData from './mock';
import { numberFormatter } from '@_utils/formatter';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
export interface IResponseData {
  total: number;
  data: TokenTransfersItemType[];
}
export default function List({ SSRData, showHeader = true }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.data],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    TokenTransfersItemType,
    IResponseData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<TokenTransfersItemType>>(() => {
    return getColumns({
      timeFormat,
      columnType: 'NFT',
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const singleTitle = useMemo(() => {
    return `A total of ${numberFormatter(String(total))} NFT transfers found`;
  }, [total]);

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        headerTitle={{
          single: {
            title: singleTitle,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
