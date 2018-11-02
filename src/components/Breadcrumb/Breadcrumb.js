import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Breadcrumb } from "antd";

import "./breadcrumb.styles.less";

const BREADCRUMBNAMEMAP = {
  "/blocks": "区块列表",
  "/txs": "交易列表",
  "/txs/block": "区块交易",
  "/adresses": "地址",
  "/block": "区块信息",
  "/tx": "交易信息",
  "/address": "地址信息"
};

// demo block/26265
// match states['block'];
// means
// Home / BREADCRUMBNAMEMAP['/blocks'] / BREADCRUMBNAMEMAP['/block']
// Linkto
// ('/') / ('/blocks'_ / (pathname + location.search)
const BREADCRUMBNAMESTATE = {
    currentState: '',
    states: {
        'blocks': {
            url: ['/blocks'],
            name: [BREADCRUMBNAMEMAP['/blocks']],
        },
        'block': {
            url: ['/blocks', false],
            name: [BREADCRUMBNAMEMAP['/blocks'], BREADCRUMBNAMEMAP['/block']],
        },
        'txs': {
            url: ['/txs', false],
            name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/txs/block']]
        },
        'tx': {
            url: ['/txs', false],
            name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/tx']]
        },
        'address': {
            // url: ['/address', false],
            url: ['/txs' , false], // 暂无地址列表
            name: [BREADCRUMBNAMEMAP['/txs'], BREADCRUMBNAMEMAP['/address']]
        },
        'apps': {
            url: ['/apps'],
            name: ['TODO']
        }
    }
};

class BrowserBreadcrumb extends Component {
    constructor(props) {
        super(props);
    }

    getFirstBreadcrumbItem() {
        return (
            <Breadcrumb.Item key="/">
                <Link to="/"> Home </Link>
            </Breadcrumb.Item>
        );
    }

    // TODO: 如果没有收录，则不展示面包屑。
    getExtraBreadcrumbItems(pathSnippets, reloadUrl) {
        const extraBreadcrumbItems = pathSnippets.map((item, index) => {
            if (index === 0) {
                BREADCRUMBNAMESTATE.currentState = item;
            }

            const STATE = BREADCRUMBNAMESTATE.states[BREADCRUMBNAMESTATE.currentState];
            const breadcrumbTitle = STATE.name[index];
            const url = STATE.url[index] || reloadUrl;

            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}> {breadcrumbTitle} </Link>
                </Breadcrumb.Item>
            );
        });

        return extraBreadcrumbItems;
    }

    getTitle(pathSnippets) {
        const pageNameMap = {
            blocks: "区块",
            block: "区块",
            txs: "交易",
            tx: "交易详情",
            address: "地址"
        };
        
        let title = [
            pageNameMap[pathSnippets[0]], 
            !!pathSnippets[1] ? (
                    <span className="breadcrumb-sub-title" key="breadcrumb-sub-title">
                        #{pathSnippets[1]}
                    </span>
                ) : '',
            ];
        return title;
    }

    render() {
        const { location } = this.props;
        const pathname = location.pathname;
        const reloadUrl = pathname + location.search;
        const className = pathname !== "/" ? "breadcrumb" : "breadcrumb hide";
        const pathSnippets = pathname.split("/").filter(i => i);

        const firstBreadcrumbItem = this.getFirstBreadcrumbItem();
        const extraBreadcrumbItems = this.getExtraBreadcrumbItems(pathSnippets, reloadUrl);
        const breadcrumbItems = [].concat(firstBreadcrumbItem, extraBreadcrumbItems);

        // route children limit to 2, so using pathSnippets[1] as condition
        const title = this.getTitle(pathSnippets);

        return (
            < div className = {
                className
            } >
                <h1 className="breadcrumb-title">{title}</h1>
                <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
        );
    }
}

export default withRouter(BrowserBreadcrumb);
