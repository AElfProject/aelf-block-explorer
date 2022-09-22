/**
 * @file old transaction list from old api
 * @author atom-yang
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TransactionList from '../TransactionList';
import config from 'constants/viewerApi';
import Dividends from 'components/Dividends';
import AddressLink from '../AddressLink';

function getColumns(contractNames, ownerAddress) {
  return [
    {
      title: 'Tx Id',
      dataIndex: 'txId',
      key: 'txId',
      ellipsis: true,
      width: 150,
      render(txId) {
        return (
          <a title={txId} href={`${config.viewer.txUrl}/${txId}`} target="_blank" rel="noopener noreferrer">
            {txId}
          </a>
        );
      },
    },
    {
      title: 'Height',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      width: 80,
      ellipsis: true,
      render(height) {
        return (
          <a href={`${config.viewer.blockUrl}/${height}`} target="_blank" rel="noopener noreferrer">
            {height}
          </a>
        );
      },
    },
    {
      title: 'Method',
      width: 120,
      dataIndex: 'method',
      key: 'method',
      ellipsis: true,
    },
    {
      title: 'Event',
      width: 130,
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
    },
    {
      title: 'Symbol',
      width: 100,
      dataIndex: 'symbol',
      key: 'symbol',
      ellipsis: true,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'to',
      ellipsis: true,
      render(from) {
        return from === ownerAddress ? `ELF_${from}_${config.viewer.chainId}` : <AddressLink address={from} />;
      },
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      ellipsis: true,
      render(to) {
        return to === ownerAddress ? `ELF_${to}_${config.viewer.chainId}` : <AddressLink address={to} />;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render(amount, record) {
        return `${Number(amount).toFixed(4)} ${record.symbol}`;
      },
    },
    {
      title: 'Tx Fee',
      dataIndex: 'txFee',
      key: 'txFee',
      render(fee) {
        return <Dividends dividends={fee} />;
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 160,
      render(time) {
        return moment(time).format('YYYY/MM/DD HH:mm:ss');
      },
    },
  ];
}

const TransferList = (props) => {
  const { owner, api } = props;
  const freezeParams = useMemo(
    () => ({
      address: owner,
    }),
    [owner],
  );
  return <TransactionList owner={owner} freezeParams={freezeParams} api={api} getColumns={getColumns} rowKey="id" />;
};

TransferList.propTypes = {
  owner: PropTypes.string.isRequired,
  api: PropTypes.string.isRequired,
};

export default React.memo(TransferList);
