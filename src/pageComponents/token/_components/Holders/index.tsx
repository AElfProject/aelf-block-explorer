import { IHolder, IHolders } from '@pageComponents/token/type';
import Table from '@_components/Table';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import fetchData from '@pageComponents/token/mock';
import getColumns from './columnConfig';
import { numberFormatter } from '@_utils/formatter';
export default function Holders({ SSRData }: { SSRData: IHolders }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.list],
    };
  };

  const columns = useMemo<ColumnsType<IHolder>>(() => {
    return getColumns();
  }, []);
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<IHolder, IHolders>({
    SSRData: disposeData(SSRData),
    fetchData: async () => {
      const res = await fetchData({ page: 1, pageSize: 25 });
      return res.holders;
    },
    disposeData: disposeData,
  });

  return (
    <div>
      <span>A total of {numberFormatter(total?.toString(), '')} holders found</span>
      <Table
        titleType="multi"
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="rank"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
