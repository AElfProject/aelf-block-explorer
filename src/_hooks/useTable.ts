import { TChainID } from '@_api/type';
import { useAppSelector } from '@_store';
import { ITableProps } from 'aelf-design';
import { SorterResult } from 'antd/es/table/interface';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  mountedRequest?: boolean;
  disposeData?: IDisposeData<T, U>;
  defaultSearch?: string;
}

export interface ITableParams<T> {
  page: number;
  pageSize: number;
  sort: SorterResult<T>;
  searchText;
}

export default function useTableData<T, U>({
  defaultPageSize = 25,
  mountedRequest = true,
  fetchData,
  SSRData,
  filterParams,
  disposeData,
  defaultSearch,
}: TableDataProps<T, U>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<T[]>(SSRData.list);
  const disposeRef = useRef(disposeData);
  disposeRef.current = disposeData;
  const mounted = useRef<boolean>(true);

  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  const getData = useCallback(
    async (params) => {
      setLoading(true);
      try {
        console.log(fetchDataRef.current, 'fetchDataRef.current');
        const res = await fetchDataRef.current({ ...params, ...filterParams });
        console.log(res, 'res');
        if (disposeRef.current) {
          const result = disposeRef.current(res);
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
    },
    [filterParams],
  );

  const [searchText, setSearchText] = useState<string>(defaultSearch ?? '');

  const searchChange = (value) => {
    setSearchText(value);
  };

  const [sortedInfo, setSortedInfo] = useState<SorterResult<T>>({});
  const handleChange: ITableProps<T>['onChange'] = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SorterResult<T>);
    setCurrentPage(1);
    setPageSize(defaultPageSize);
  };

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log(mounted.current, 'mounted.current');
    if (!mountedRequest && mounted.current) {
      mounted.current = false;
      return;
    }
    getData({ page: currentPage, pageSize: pageSize, sort: sortedInfo, searchText });
  }, [currentPage, pageSize, sortedInfo, searchText, getData, mountedRequest]);

  const pageSizeChange = async (size) => {
    setPageSize(size);
    setCurrentPage(1);
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
