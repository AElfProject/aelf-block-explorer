/**
 * @file TxsDetail
 * @author huangzongzhe
 */

import React from 'react';
import { Row, Col, Tag, Input } from 'antd';
import { isEmpty } from 'lodash';
import AElf from 'aelf-sdk';
import { aelf, formatKey } from '../../utils';
import addressFormat from '../../utils/addressFormat';

import './txsdetail.styles.less';

const {TextArea} = Input;

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
      blockHash: ''
    };
  }

  fetchTxInfo = txsId => {
    // console.log(aelf.chain.getTxResult(txsId));
    if (isEmpty(txsId)) {
      return;
    }

    aelf.chain.getTxResult(txsId).then(result => {
      this.setState({
        result,
        error: null
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
    } catch(e) {
      // do nothing
    }

    return <textarea
      rows={rows}
      value={jsonFormatted}
      className='tx-block-code-like-content'
      disabled>
    </textarea>
  }

  renderCol(key, value) {
    if (typeof value === 'object') {
      // return this.renderCols(value);
      value = JSON.stringify(value);
    }
    // console.log('txDetail key: ', key);
    let valueHTML = value;
    const {LastIrreversibleBlockHeight} = this.state.chainStatus;

    switch (key) {
      case 'Status':
        valueHTML = this.renderStatus(value);
        break;
      case 'Logs':
        if (value !== 'null' && value) {
          valueHTML = this.renderCodeLikeParams(value, 8);
        }
        break;
      case 'Transaction_Params':
        valueHTML = this.renderCodeLikeParams(value, 6);
        break;
      case 'Transaction_From':
        valueHTML = addressFormat(value);
        break;
      case 'Transaction_To':
        valueHTML = addressFormat(value);
        break;
      case 'Bloom':
        valueHTML = this.renderCodeLikeParams(value, 1);
        break;
      case 'BlockNumber':
        if (!LastIrreversibleBlockHeight) {
          return valueHTML;
        }
        // console.log('LastIrreversibleBlockHeight: ', LastIrreversibleBlockHeight, value, this.state.chainStatus);
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

  renderFee(result = {}) {
    const logs = result.Logs;
    if (logs !== 'null' && logs) {
      const txFee = AElf.pbUtils.getTransactionFee(logs);
      const resourceFee = AElf.pbUtils.getResourceFee(logs);
      if (txFee.length || resourceFee.length) {
        const txStr = txFee.length ? JSON.stringify(txFee[0]) : '';
        const resourceStr = resourceFee.length ? JSON.stringify(resourceFee[0]) : '';
        return this.renderCol('Fee', txStr + resourceStr);
      }
    }
  }

  render() {
    const { error, result } = this.state;
    const colsHtml = this.renderCols(error || result);
    const feeHTML = this.renderFee(error || result);

    return (
      <div className='tx-block-detail-container basic-container basic-container-white'>
        <div className='tx-block-detail-panel tx-block-detail-panel-simple'>
          <span className='title'>Overview</span>
        </div>
        <Row className='tx-block-detail-body'>{colsHtml}{feeHTML}</Row>
      </div>
    );
  }
}
