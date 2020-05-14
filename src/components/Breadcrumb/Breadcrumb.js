import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {Breadcrumb} from 'antd';

import {ADDRESS_INFO} from '../../../config/config';

import './breadcrumb.styles.less';

// if you want to hide the Breadcrumb
const NO_BREADCRUMB_PAGES = ['/vote', '/proposal', '/address', '/contract'];
const noBreadcrumb = (pathname) => {
  const isMainPage = pathname === '/';
  return NO_BREADCRUMB_PAGES.filter(item => {
    return pathname.includes(item);
  }).length === 0 && !isMainPage;
};

const BREADCRUMB_NAME_MAP = {
  // "/blocks": "区块列表",
  // "/txs": "交易列表",
  // "/txs/block": "区块交易",
  // "/adresses": "地址",
  // "/block": "区块信息",
  // "/tx": "交易信息",
  // "/address": "地址信息"
  '/blocks': 'Blocks List',
  '/unconfirmedBlocks': 'Unconfirmed Blocks List',
  '/txs': 'Transactions List',
  '/txs/block': 'Transactions of Block',
  '/block': 'Block',
  '/unconfirmedBlock': 'Unconfirmed Block',
  '/tx': 'Transaction',
  '/address': 'Address',
  '/vote': 'Vote',
  '/resource': 'Resource',
  '/resourceDetail': 'Resource Detail List',
  '/contract': 'Contract',
  '/proposal': 'Proposal',
  'myvote': 'My Vote'
};

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'
const BREADCRUMB_NAMES_TATE = {
  currentState: '',
  states: {
    blocks: {
      url: ['/blocks'],
      name: [BREADCRUMB_NAME_MAP['/blocks']]
    },
    block: {
      url: ['/blocks', false],
      name: [BREADCRUMB_NAME_MAP['/blocks'], BREADCRUMB_NAME_MAP['/block']]
    },
    unconfirmedBlocks: {
      url: ['/unconfirmedBlocks'],
      name: [BREADCRUMB_NAME_MAP['/unconfirmedBlocks']]
    },
    unconfirmedBlock: {
      url: ['/unconfirmedBlock'],
      name: [BREADCRUMB_NAME_MAP['/unconfirmedBlock']]
    },
    txs: {
      url: ['/txs', false],
      name: [BREADCRUMB_NAME_MAP['/txs'], BREADCRUMB_NAME_MAP['/txs/block']]
    },
    tx: {
      url: ['/txs', false],
      name: [BREADCRUMB_NAME_MAP['/txs'], BREADCRUMB_NAME_MAP['/tx']]
    },
    address: {
      url: ['/txs', false],
      name: [BREADCRUMB_NAME_MAP['/txs'], BREADCRUMB_NAME_MAP['/address']]
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
        BREADCRUMB_NAME_MAP['/resource'],
        BREADCRUMB_NAME_MAP['/resourceDetail']
      ]
    },
    contract: {
      url: ['/contract'],
      name: [
        BREADCRUMB_NAME_MAP['/contract']
      ]
    },
    proposal: {
      url: ['/proposal', false],
      name: ['Proposal']
    },
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

    const current = BREADCRUMB_NAMES_TATE.currentState;
    const pathname = location.pathname;

    // hummm, stupid solution
    const inBlockDetail = current === 'block' && breadcrumbTitle === 'Blocks List';
    const inUnconfirmedBlock = current === 'unconfirmedBlock' && breadcrumbTitle === 'Unconfirmed Blocks List';
    const inTxList = current === 'txs' && breadcrumbTitle === 'Transactions List' && pathname !== '/txs';
    const inAddress = current === 'address' && breadcrumbTitle === 'Transactions List';
    const inTxDetail = current === 'tx' && breadcrumbTitle === 'Transactions List';
    const inResourceDetail = current === 'resourceDetail' && breadcrumbTitle === 'Resource';
    const inContract = current === 'contract';

    if (inBlockDetail || inTxList || inAddress || inTxDetail || inResourceDetail || inContract || inUnconfirmedBlock) {
      return false;
    }

    return location.pathname.includes(current);
  }

  // TODO: 如果没有收录，则不展示面包屑。
  getExtraBreadcrumbItems(pathSnippets, reloadUrl) {
    return pathSnippets.map((item, index) => {
      if (index === 0) {
        BREADCRUMB_NAMES_TATE.currentState = item;
      }

      const STATE =
        BREADCRUMB_NAMES_TATE.states[BREADCRUMB_NAMES_TATE.currentState];

      if (!STATE) {
        this.props.history.push('/');
        return;
      }

      let breadcrumbTitle = STATE.name[index]
        ? STATE.name[index]
        : BREADCRUMB_NAME_MAP[item];

      const url =
        index === pathSnippets.length - 1
          ? STATE.url[index] || reloadUrl
          : STATE.url[index] ||
          `/${pathSnippets.slice(0, index + 1).join('/')}`;

      console.log('breadcrumbTitle: ', breadcrumbTitle);
      const isCurrentTitle = this.checkLocation(breadcrumbTitle);

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
  }

  getBreadcrumbTitle(pathSnippets) {
    const pageNameMap = {
      blocks: (
        <div className='breadcrumb-title' style={{ fontSize: 28 }}>
          {' '}
          Blocks List{' '}
          <span className='tip-color' style={{ fontSize: 16 }}>
            ( Only confirmed blocks )
          </span>
        </div>
      ),
      unconfirmedBlocks: 'Unconfirmed Blocks List',
      block: 'Block',
      unconfirmedBlock: 'Unconfirmed Block',
      txs: 'Transactions',
      tx: 'Transaction',
      address: 'Address',
      contract: 'Contract',
      proposal: 'Proposal',
      resource: (
        <span className='breadcrumb-title breadcrumb-small-title'>
          Resource Trading
        </span>
      ),
      resourceDetail: (
        <span className='breadcrumb-title breadcrumb-small-title'>
          Transaction Details
        </span>
      )
    };

    return [
      pageNameMap[pathSnippets[0]],
      !!pathSnippets[1] ? (
        <span className='breadcrumb-sub-title' key='breadcrumb-sub-title'>
          {pathSnippets[0] === 'address' || pathSnippets[0] === 'resourceDetail' ?
            '#' + ADDRESS_INFO.PREFIX + '_' + pathSnippets[1] + '_' + ADDRESS_INFO.CURRENT_CHAIN_ID
            :
            '#' + pathSnippets[1]}
        </span>
      ) : (
        ''
      )
    ];
  }

  render() {
    const {
      location
    } = this.props;
    const pathname = location.pathname;
    const reloadUrl = pathname + location.search;
    const className = noBreadcrumb(pathname) ? 'breadcrumb' : 'breadcrumb hide';
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
    const title = this.getBreadcrumbTitle(pathSnippets);

    return (
      <div className={className}>
        <h1 className='breadcrumb-title'>{title}</h1>
        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
      </div>
    );
  }
}

export default withRouter(BrowserBreadcrumb);
