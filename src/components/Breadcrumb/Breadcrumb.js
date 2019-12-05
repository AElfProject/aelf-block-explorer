import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Breadcrumb } from 'antd';

import {ADDRESS_INFO} from '../../../config/config';

import './breadcrumb.styles.less';

const BREADCRUMBNAMEMAP = {
  // "/blocks": "区块列表",
  // "/txs": "交易列表",
  // "/txs/block": "区块交易",
  // "/adresses": "地址",
  // "/block": "区块信息",
  // "/tx": "交易信息",
  // "/address": "地址信息"
  '/blocks': 'Blocks List',
  '/txs': 'Transactions List',
  '/txs/block': 'Transactions of Block',
  '/block': 'Block',
  '/tx': 'Transaction',
  '/address': 'Address',
  '/vote': 'Vote',
  '/resource': 'Resource',
  '/resourceDetail': 'Resource Detail List',
  '/contract': 'Contract',
  myvote: 'My Vote'
};

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'
const BREADCRUMBNAMESTATE = {
  currentState: '',
  states: {
    blocks: {
      url: ['/blocks'],
      name: [BREADCRUMBNAMEMAP['/blocks']]
    },
    block: {
      url: ['/blocks', false],
      name: [BREADCRUMBNAMEMAP['/blocks'], BREADCRUMBNAMEMAP['/block']]
    },
    txs: {
      url: ['/txs', false],
      name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/txs/block']]
    },
    tx: {
      url: ['/txs', false],
      name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/tx']]
    },
    address: {
      // url: ['/address', false],
      url: ['/txs', false], // 暂无地址列表
      name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/address']]
    },
    apps: {
      url: ['/apps'],
      name: ['App Center']
    },
    vote: {
      url: ['/vote'],
      name: ['Vote']
    },
    resource: {
      url: ['/resource', false],
      name: ['Resource']
    },
    resourceDetail: {
      url: ['/resource', '/resourceDetail'],
      name: [
        BREADCRUMBNAMEMAP['/resource'],
        BREADCRUMBNAMEMAP['/resourceDetail']
      ]
    },
    contract: {
      url: ['/contract'],
      name: [
        BREADCRUMBNAMEMAP['/contract']
      ]
    }
  }
};

class BrowserBreadcrumb extends Component {
  constructor(props) {
    super(props);
  }

  getFirstBreadcrumbItem() {
    return (
      <Breadcrumb.Item key='/'>
        <Link to='/' onClick={this.handleClick}>
          {' '}
          Home{' '}
        </Link>
      </Breadcrumb.Item>
    );
  }

  checkLocation (breadcrumbTitle) {

    console.log('this.props.history: ', this.props.history);
    console.log('this.props.history: breadcrumbTitle: ', breadcrumbTitle, BREADCRUMBNAMESTATE.currentState);
    const current = BREADCRUMBNAMESTATE.currentState;
    const pathname = location.pathname;

    // hummm, stupid solution
    const inBlockDetail = current === 'block' && breadcrumbTitle === 'Blocks List';
    const inTxList = current === 'txs' && breadcrumbTitle === 'Transactions List' && pathname !== '/txs';
    const inAddress = current === 'address' && breadcrumbTitle === 'Transactions List';
    const inTxDetail = current === 'tx' && breadcrumbTitle === 'Transactions List';

    if (inBlockDetail || inTxList || inAddress || inTxDetail) {
      return false;
    }

    return location.pathname.includes(current);
  }

  // TODO: 如果没有收录，则不展示面包屑。
  getExtraBreadcrumbItems(pathSnippets, reloadUrl) {
    const extraBreadcrumbItems = pathSnippets.map((item, index) => {
      if (index === 0) {
        BREADCRUMBNAMESTATE.currentState = item;
      }

      const STATE =
        BREADCRUMBNAMESTATE.states[BREADCRUMBNAMESTATE.currentState];

      if (!STATE) {
        this.props.history.push('/');
        return;
      }

      let breadcrumbTitle = STATE.name[index]
        ? STATE.name[index]
        : BREADCRUMBNAMEMAP[item];
      if (breadcrumbTitle === undefined) {
        breadcrumbTitle = item.replace(/^\S/, s => s.toUpperCase());
      }
      const url =
        index === pathSnippets.length - 1
          ? STATE.url[index] || reloadUrl
          : STATE.url[index] ||
            `/${pathSnippets.slice(0, index + 1).join('/')}`;

      const isCurrentTitle =  this.checkLocation(breadcrumbTitle);

      return (
        <Breadcrumb.Item key={url}>
          {isCurrentTitle ?
            <span className={isCurrentTitle ? 'current-title' : ''}>{breadcrumbTitle}</span>
            :
            <Link to={url}> {breadcrumbTitle} </Link>
          }

        </Breadcrumb.Item>
      );
    });

    return extraBreadcrumbItems;
  }

  getTitle(pathSnippets) {
    const pageNameMap = {
      // blocks: "区块",
      // block: "区块",
      // txs: "交易",
      // tx: "交易详情",
      // address: "地址",
      blocks: (
        <h1 className='breadcrumb-title' style={{ fontSize: 28 }}>
          {' '}
          Blocks List{' '}
          <span className='tip-color' style={{ fontSize: 16 }}>
            ( Only confirmed blocks )
          </span>
        </h1>
      ),
      block: 'Block',
      txs: 'Transactions',
      tx: 'Transaction',
      address: 'Address',
      contract: 'Contract'
    };

    let title = [
      pageNameMap[pathSnippets[0]],
      !!pathSnippets[1] ? (
        <span className='breadcrumb-sub-title' key='breadcrumb-sub-title'>
          { pathSnippets[0] === 'address' ?
            '#' + ADDRESS_INFO.PREFIX + '_' + pathSnippets[1] + '_' + ADDRESS_INFO.CURRENT_CHAIN_ID
            :
            '#' + pathSnippets[1]}
        </span>
      ) : (
        ''
      )
    ];
    return title;
  }

  render() {
    const { location } = this.props;
    const pathname = location.pathname;
    const reloadUrl = pathname + location.search;
    const className = pathname !== '/' ? 'breadcrumb' : 'breadcrumb hide';
    const pathSnippets = pathname.split('/').filter(i => i);

    const firstBreadcrumbItem = this.getFirstBreadcrumbItem();
    const extraBreadcrumbItems = this.getExtraBreadcrumbItems(
      pathSnippets,
      reloadUrl
    );
    const breadcrumbItems = [].concat(
      firstBreadcrumbItem,
      extraBreadcrumbItems
    );

    // route children limit to 2, so using pathSnippets[1] as condition
    const title = this.getTitle(pathSnippets);

    return (
      <div className={className}>
        <h1 className='breadcrumb-title'>{title}</h1>
        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
      </div>
    );
  }
}

export default withRouter(BrowserBreadcrumb);
