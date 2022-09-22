/**
 * @file old transaction list from old api
 * @author atom-yang
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TransactionList from '../TransactionList';

function formatParams(params) {
  return {
    limit: params.pageSize,
    page: params.pageNum - 1,
    address: params.address,
    order: 'DESC',
  };
}

function formatResponse(data) {
  const {
    total = 0,
    transactions = [],
  } = data;
  return {
    total,
    list: transactions.map((item) => ({
      txId: item.tx_id,
      blockHeight: item.block_height,
      method: item.method,
      addressFrom: item.address_from,
      addressTo: item.address_to,
      txFee: JSON.parse(item.tx_fee),
      time: item.time,
    })),
  };
}

const OldTransactionList = (props) => {
  const {
    owner,
    api,
  } = props;
  const freezeParams = useMemo(() => ({
    address: owner,
  }), [owner]);
  return (
    <TransactionList
      owner={owner}
      freezeParams={freezeParams}
      api={api}
      responseFormatter={formatResponse}
      requestParamsFormatter={formatParams}
      rowKey="txId"
    />
  );
};

OldTransactionList.propTypes = {
  owner: PropTypes.string.isRequired,
  api: PropTypes.string.isRequired,
};

export default OldTransactionList;
