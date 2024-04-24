import Table from '@_components/Table';
import { useState } from 'react';
import fetchData from './mock';
import getColumns from './columnConfig';
import './index.css';
import { TokensListItemType } from '@_types/commonDetail';
import { useEffectOnce } from 'react-use';
import { useMobileContext } from '@app/pageProvider';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export default function TokensList({ SSRData = { total: 0, list: [] } }) {
  const { isMobile } = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TokensListItemType[]>(SSRData.list);
  const [searchText, setSearchText] = useState<string>('');
  useEffectOnce(() => {
    async function getData() {
      setLoading(true);
      const data = await fetchData({ page: currentPage, pageSize: pageSize });
      setData(data.list);
      setTotal(data.total);
      setLoading(false);
    }
    getData();
  });
  const columns = getColumns({
    columnKey: '',
  });

  const pageChange = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    const data = await fetchData({ page, pageSize: pageSize });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };

  const pageSizeChange = async (size) => {
    setLoading(true);
    setPageSize(size);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: size });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };
  const searchChange = async () => {
    setLoading(true);
    setCurrentPage(1);
    const data = await fetchData({ page: 1, pageSize: pageSize });
    setData(data.list);
    setTotal(data.total);
    setLoading(false);
  };

  return (
    <div className="token-list px-4">
      <div className="table-container py-4 pb-0">
        <Table
          showTopSearch
          headerTitle={{
            multi: {
              title: 'Tokens (7)',
              desc: 'Total Value : $78,330.38',
            },
          }}
          topSearchProps={{
            value: searchText,
            placeholder: 'Search Token Name  Token Symbol',
            onChange: ({ currentTarget }) => {
              setSearchText(currentTarget.value);
            },
            onSearchChange: () => {
              searchChange();
            },
          }}
          loading={loading}
          options={[
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ]}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey="asset"
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
