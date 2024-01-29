import EPSearch from '@_components/EPSearch';
import Table from '@_components/Table';
import fetchData from './mock';
import getColumns from './columnConfig';
import './index.css';
import { TokensListItemType } from '@_types/commonDetail';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import useTableData from '@_hooks/useTable';
interface ITransactionsData {
  total: number;
  list: TokensListItemType[];
}
export default function TokensList({
  SSRData = {
    total: 100,
    list: [],
  },
}) {
  const { isMobileSSR: isMobile } = useMobileContext();

  const {
    loading,
    total,
    searchText,
    searchChange,
    data,
    currentPage,
    pageSize,
    sortedInfo,
    pageChange,
    pageSizeChange,
    handleChange,
  } = useTableData<TokensListItemType, ITransactionsData>({
    SSRData: SSRData,
    fetchData: fetchData,
    defaultPageSize: 10,
  });

  const columns = getColumns(sortedInfo);

  return (
    <div className="token-list px-4">
      <div
        className={clsx(
          'header-container flex items-center justify-between py-4',
          isMobile && 'flex-col !items-start',
        )}>
        <div className={clsx(isMobile && 'flex-col mb-3', 'title-container')}>
          <div className="total text-base-100 text-sm leading-[22px]">Tokens (7)</div>
          <div className="info text-xs text-base-200 leading-5">Total Value : $78,330.38</div>
        </div>
        <div className="tool-container">
          <EPSearch
            value={searchText}
            onChange={({ currentTarget }) => {
              searchChange(currentTarget.value);
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
          showSorterTooltip={false}
          columns={columns}
          isMobile={isMobile}
          rowKey="asset"
          total={total}
          onChange={handleChange}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
