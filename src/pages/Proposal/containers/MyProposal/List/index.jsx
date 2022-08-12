/**
 * @file list
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Pagination,
  Input,
} from 'antd';
import Total from '../../../../../components/Total';

const { Search } = Input;

const List = (props) => {
  const {
    pageNum,
    pageSize,
    onSearch,
    onPageChange,
    tableColumns,
    loading,
    searchPlaceholder,
    list,
    total,
    rowKey,
  } = props;
  const [search, setSearch] = useState('');
  useEffect(() => {
    setSearch('');
  }, [tableColumns]);
  function searchChange(e) {
    setSearch(e.target.value);
  }
  return (
    <div className="my-proposal-content">
      <Search
        className="my-proposal-content-filter gap-bottom"
        placeholder={searchPlaceholder}
        allowClear
        value={search}
        onChange={searchChange}
        onSearch={onSearch}
      />
      <div className="my-proposal-content-list">
        <Table
          dataSource={list}
          columns={tableColumns}
          loading={loading}
          pagination={false}
          rowKey={rowKey}
          // scroll={{ x: 1300 }}
        />
      </div>
      <Pagination
        className="float-right gap-top"
        showQuickJumper
        total={total}
        current={pageNum}
        pageSize={pageSize}
        hideOnSinglePage
        onChange={onPageChange}
        showTotal={Total}
      />
    </div>
  );
};

List.propTypes = {
  pageSize: PropTypes.number.isRequired,
  pageNum: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  list: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  rowKey: PropTypes.string.isRequired,
};

export default React.memo(List);
