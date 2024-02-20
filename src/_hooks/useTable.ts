import { ITableProps } from 'aelf-design';
import { SorterResult } from 'antd/es/table/interface';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
// interface IParams {
//   page: number;
//   pageSize: number;
//   [propName: string]: any;
// }

interface IFetchDataItems<T> {
  total: number;
  list: T[];
}

interface IFetchData<U> {
  (IParams): Promise<U>;
}

interface IDisposeData<T, U> {
  (value: Awaited<U>): IFetchDataItems<T>;
}

interface TableDataProps<T, U> {
  defaultPageSize?: number;
  fetchData: IFetchData<U>;
  SSRData: IFetchDataItems<T>;
  filterParams?: object;
  disposeData?: IDisposeData<T, U>;
}

export default function useTableData<T, U>({
  defaultPageSize = 25,
  fetchData,
  SSRData,
  filterParams,
  disposeData,
}: TableDataProps<T, U>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<T[]>(SSRData.list);
  const getData = async (params) => {
    setLoading(true);
    try {
      const res = await fetchData({ ...params, ...filterParams });
      if (disposeData) {
        const result = disposeData(res);
        setData(result.list);
        setTotal(result.total);
      } else {
        const result = res as IFetchDataItems<T>;
        setData(result.list);
        setTotal(result.total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const [searchText, setSearchText] = useState<string>('');
  const mounted = useRef(false);
  useDebounce(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      setCurrentPage(1);
      setPageSize(defaultPageSize);
      getData({ page: 1, pageSize: defaultPageSize, sort: sortedInfo, searchText });
    },
    300,
    [searchText],
  );

  const searchChange = (value) => {
    setSearchText(value);
  };

  const [sortedInfo, setSortedInfo] = useState<SorterResult<T>>({});
  const handleChange: ITableProps<T>['onChange'] = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SorterResult<T>);
    setCurrentPage(1);
    setPageSize(defaultPageSize);
    getData({ page: 1, pageSize: defaultPageSize, sort: sorter, searchText });
  };

  const pageChange = async (page: number) => {
    setCurrentPage(page);
    getData({ page, pageSize: pageSize, sort: sortedInfo, searchText });
  };

  useEffect(() => {
    console.log('useTable');
    getData({ page: currentPage, pageSize: pageSize, sort: sortedInfo, searchText });
  }, []);

  const pageSizeChange = async (size) => {
    setPageSize(size);
    setCurrentPage(1);
    getData({ page: 1, pageSize: size, sort: sortedInfo, searchText });
  };

  return {
    searchText,
    loading,
    sortedInfo,
    total,
    data,
    currentPage,
    pageSize,
    pageChange,
    pageSizeChange,
    handleChange,
    searchChange,
    setSearchText,
  };
}
