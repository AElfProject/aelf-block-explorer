/**
 * @file item list
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
require('./index.less');

const { Option } = Select;

const TokenList = (props) => {
  const { balances } = props;
  function onFilter(input, option) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  return (
    <Select
      showSearch={balances.length > 4}
      placeholder="Search Tokens"
      optionFilterProp="children"
      className="token-list-select"
      filterOption={onFilter}>
      {balances.map((b) => (
        <Option key={b.symbol} value={b.symbol}>
          <span>{b.symbol}</span>
          <span className="float-right">{Number(b.balance).toLocaleString()}</span>
        </Option>
      ))}
    </Select>
  );
};

TokenList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  balances: PropTypes.array.isRequired,
};

export default React.memo(TokenList);
