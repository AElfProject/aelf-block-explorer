/**
 * @file TxsDetail
 * @author huangzongzhe
 */

import React from 'react';
import { Row, Col, Tag, Input } from 'antd';
import { isEmpty } from 'lodash';
import { aelf, formatKey } from '../../utils';

import './txsdetail.styles.less';

const {TextArea} = Input;

export default class TxsDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txsId: props.match.params.id || '',
      status: 'Pending',
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
    aelf.chain.getTxResult(txsId, (error, result) => {
      this.setState({
        result,
        error
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

    switch (key) {
      case 'Status':
        valueHTML = this.renderStatus(value);
        break;
      case 'Transaction_Params':
        valueHTML = this.renderCodeLikeParams(value);
        break;
      case 'Bloom':
        valueHTML = this.renderCodeLikeParams(value, 1);
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

  render() {
    const { error, result } = this.state;
    const colsHtml = this.renderCols(error || result);

    return (
      <div className='tx-block-detail-container basic-container basic-container-white'>
        <div className='tx-block-detail-panel tx-block-detail-panel-simple'>
          <span className='title'>Overview</span>
        </div>
        <Row className='tx-block-detail-body'>{colsHtml}</Row>

        {/*<div className='basic-bottom-blank' />*/}
      </div>
    );
  }
}
