/**
 * @file TxsDetail
 * @author huangzongzhe
 */

import React from 'react';
import { Row, Col, Tag } from 'antd';
import { isEmpty } from 'lodash';
import {aelf, formatKey, get, getContractNames} from '../../utils';
import addressFormat from '../../utils/addressFormat';
import {
  removeAElfPrefix,
  getFee
} from '../../utils/utils';
import {
  CONTRACT_VIEWER_URL,
  TXS_INFO_API_URL
} from '../../constants';

import './txsdetail.styles.less';
import {Link} from "react-router-dom";
import Dividends from "../../components/Dividends";
import moment from "moment";
import Events from "../../components/Events";

async function getInfoBackUp(transaction) {
  const {
    BlockNumber
  } = transaction;
  const block = await aelf.chain.getBlockByHeight(BlockNumber, false);
  const {
    Header: {
      Time
    }
  } = block;
  return {
    ...(await getFee(transaction)),
    time: Time
  };
}

export default class TxsDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txsId: props.match.params.id || '',
      status: 'Pending',
      chainStatus: {},
      blockHeight: -1,
      from: '',
      to: '',
      blockHash: '',
      contractName: '',
      parsedResult: {}
    };
  }

  fetchTxInfo = txsId => {
    if (isEmpty(txsId)) {
      return;
    }
    aelf.chain.getTxResult(txsId).then(result => {
      this.setState({
        result,
        error: null
      });
      getInfoBackUp(result).then(backup => {
        this.setState({
          parsedResult: {
            time: backup.time,
            resources: backup.resources,
            tx_fee: backup.fee
          }
        });
      });
      getContractNames().then(names => {
        let name = names[result.Transaction.To] || {};
        name = name && name.isSystemContract ? removeAElfPrefix(name.contractName) : name.contractName;
        this.setState({
          contractName: name || result.Transaction.To
        });
      }).catch(e => {
        console.log(e);
      });
    }).catch(error => {
      this.setState({
        result: {},
        error
      });
    });

    aelf.chain.getChainStatus().then(chainStatus => {
      this.setState({
        chainStatus,
      });
    });
  };

  componentDidMount() {
    const { params } = this.props.match;
    this.fetchTxInfo(params.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { params } = this.props.match;
    if (prevProps.match.params.id !== params.id) {
      this.fetchTxInfo(params.id);
    }
  }

  renderStatus(value) {
    switch (value) {
      case 'MINED':
        return <Tag color="green">{value}</Tag>;
        break;
      case 'FAILED':
        return <Tag color="red">{value}</Tag>;
        break;
      case 'PENDING':
        return <Tag color="orange">{value}</Tag>;
        break;
      default:
        return <Tag>{value}</Tag>;
        break;
    }
  }

  renderCodeLikeParams(value, rows = 8) {
    let jsonFormatted = value;
    try {
      jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
    } catch(e) {}

    return <textarea
      rows={rows}
      value={jsonFormatted}
      className='tx-block-code-like-content'
      disabled>
    </textarea>
  }

  renderLogs(logs) {
    let list;
    try {
      list = JSON.parse(logs);
    } catch (e) {
      list =  [];
    }
    if (Array.isArray(list) && list.length > 0) {
      return <Events list={list} />;
    } else {
      return this.renderCodeLikeParams(list, 1);
    }
  }

  renderCol(key, value) {
    if (typeof value === 'object' && !React.isValidElement(value)) {
      value = JSON.stringify(value);
    }
    // console.log('txDetail key: ', key);
    let valueHTML = value;
    const {LastIrreversibleBlockHeight} = this.state.chainStatus;
    const {
      contractName
    } = this.state;
    switch (key) {
      case 'Status':
        valueHTML = this.renderStatus(value);
        break;
      case 'Logs':
        if (value !== 'null' && value) {
          valueHTML = this.renderLogs(value);
        }
        break;
      case 'TransactionSize':
        valueHTML = `${(value || '0').toLocaleString()} Bytes`;
        break;
      case 'Transaction_Params':
        valueHTML = this.renderCodeLikeParams(value, 6);
        break;
      case 'Transaction_From':
        valueHTML = addressFormat(value);
        break;
      case 'Transaction_To':
        valueHTML = (<Link
            to={`/contract?#${decodeURIComponent(CONTRACT_VIEWER_URL + value)}`}
            title={addressFormat(value)}
        >
          {
            contractName ? contractName : addressFormat(value)
          }
        </Link>);
        break;
      case 'Bloom':
        valueHTML = this.renderCodeLikeParams(value, 1);
        break;
      case 'BlockNumber':
        if (!LastIrreversibleBlockHeight) {
          return valueHTML;
        }
        const confirmedBlocks = LastIrreversibleBlockHeight - value;
        const isIB = confirmedBlocks >= 0;

        valueHTML = (<>
          {value} {isIB
            ? <Tag>{confirmedBlocks} Block Confirmations </Tag>
            : (<Tag color='red'>Unconfirmed</Tag>)}
          </>);
        break;
    }

    return (
      <Row className='tx-detail-row' key={key}>
        <Col
          xs={24} sm={24} md={6} lg={6} xl={6} className='title'
          style={{ height: 'auto' }}
        >
          {formatKey(key)}
        </Col>
        <Col
          style={{ height: 'auto', wordBreak: 'break-all' }}
          xs={24} sm={24} md={18} lg={18} xl={18}
        >
          <div className="text-ellipsis">{valueHTML}</div>
        </Col>
        {/* <Divider dashed style={{ marginTop: 10 }} /> */}
      </Row>
    );
  }

  renderCols(result = {}) {
    const blackList = ['tx_trc', 'return'];
    return Object.keys(result).filter(v => blackList.indexOf(v) < 0).map(key => {
      const item = result[key];
      if (item && typeof item === 'object' && key.toLowerCase() !== 'logs') {
        return Object.keys(item).map(innerKey => {
          return this.renderCol(`${key}_${innerKey}`, item[innerKey]);
        });
      }
      return this.renderCol(key, item);
    }).reduce((acc, v) => acc.concat(v), []);
  }

  renderExtra() {
    const {
      parsedResult
    } = this.state;
    if (Object.keys(parsedResult).length > 0) {
      const {
        time,
        resources,
        tx_fee
      } = parsedResult;
      return [
          this.renderCol('Time', moment(time).format('YYYY-MM-DD  HH:mm:ss')),
          this.renderCol('Transaction Fee', <Dividends dividends={tx_fee} />),
          this.renderCol('Resources Fee', <Dividends defaultSymbol="" dividends={resources} />)
      ]
    }
    return null;
  }

  render() {
    const { error, result } = this.state;
    const colsHtml = this.renderCols(error || result);

    return (
      <div className='tx-block-detail-container basic-container basic-container-white'>
        <div className='tx-block-detail-panel tx-block-detail-panel-simple'>
          <span className='title'>Overview</span>
        </div>
        <Row className='tx-block-detail-body'>
          {colsHtml}
          {this.renderExtra()}
        </Row>
      </div>
    );
  }
}
