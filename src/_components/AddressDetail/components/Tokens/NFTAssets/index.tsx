import EPSearch from '@_components/EPSearch';
import Table from '@_components/Table';
import { useState } from 'react';
import fetchData from './mock';
import getColumns from './columnConfig';
import './index.css';
import { NftsItemType } from '@_types/commonDetail';
import { useDebounce, useEffectOnce } from 'react-use';
import clsx from 'clsx';
import { useMobileContext } from '@app/pageProvider';
export default function NFTAssets({ SSRData = { total: 0, list: [] } }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<NftsItemType[]>(SSRData.list);
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
  const columns = getColumns();

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
  useDebounce(
    () => {
      searchChange();
    },
    300,
    [searchText],
  );
  const { isMobileSSR: isMobile } = useMobileContext();
  return (
    <div className="asset-list px-4">
      <div
        className={clsx(
          'asset-header-container flex items-center justify-between py-4',
          isMobile && 'flex-col !items-start',
        )}>
        <div className={clsx('title-container', isMobile && 'mb-3')}>
          <div className="total text-sm leading-[22px] text-base-100">NFT Assets (7)</div>
        </div>
        <div className="tool-container">
          <EPSearch
            value={searchText}
            onChange={({ currentTarget }) => {
              setSearchText(currentTarget.value);
            }}
          />
        </div>
      </div>
      <div className="table-container">
        <Table
          titleType="multi"
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
          rowKey="item"
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
