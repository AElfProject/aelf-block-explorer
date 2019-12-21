/**
 * @file TxsDetail
 * @author huangzongzhe
 */

import React from 'react';
import { Row, Col, Divider } from 'antd';
import { isEmpty, map } from 'lodash';
import { aelf, formatKey } from '../../utils';

import './txsdetail.styles.less';

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

  renderCol(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
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
          <div>{value}</div>
        </Col>
        {/* <Divider dashed style={{ marginTop: 10 }} /> */}
      </Row>
    );
  }

  renderCols() {
    const { result = {} } = this.state;
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
    const { error } = this.state;
    let colsHtml;
    if (error) {
      colsHtml = this.renderCol('error', error);
    } else {
      colsHtml = this.renderCols();
    }

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
