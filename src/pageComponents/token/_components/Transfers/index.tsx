import { ITransfers, ITransfer } from '@pageComponents/token/type';
import Table from '@_components/Table';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import fetchData from '@pageComponents/token/mock';
import getColumns from './columnConfig';
export default function Transfers({ SSRData }: { SSRData: ITransfers }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.list],
    };
  };

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<ITransfer>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    ITransfers,
    ITransfers
  >({
    SSRData: disposeData(SSRData),
    fetchData: async () => {
      const res = await fetchData({ page: 1, pageSize: 25 });
      return res.transfers;
    },
    disposeData: disposeData,
  });

  return (
    <div>
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
