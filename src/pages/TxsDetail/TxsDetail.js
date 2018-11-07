import React from "react";
import { Row, Col } from "antd";
import { isEmpty, map } from "lodash";
import { aelf } from "../../utils";

import "./txsdetail.styles.less";

export default class TxsDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txsId: props.match.params.id || "",
            status: "Pending",
            blockHeight: -1,
            from: "",
            to: "",
            blockHash: ""
        };
    }

    fetchTxInfo = txsId => {
        if (isEmpty(txsId)) {
            return;
        }

        const { result = {
            block_hash: 'Not found',
            block_number: 'Not found',
            tx_info: {},
            tx_status: 'Not found',
        }, error = '' } = aelf.chain.getTxResult(txsId);
        this.setState({
            result: result,
            error: error
        });
    };

    componentDidMount() {
        const { params } = this.props.match;
        this.fetchTxInfo(params.id);
    }

    renderCol (key, value) {
        return (
            <div key={key + Math.random()}>
                <Col span={3} style={{height: 'auto'}}>{key}</Col>
                <Col span={21} style={{height: 'auto'}}>{value}</Col>
            </div>
        );
    }

    renderCols () {
        const result = this.state.result;
        let html = [];
        let blackList = ['tx_trc', 'return'];

        for (const each in result) {
            if (blackList.indexOf(each) >= 0) {

            } else if (typeof result[each] === 'object') {
                let resultItem = result[each];
                for (const each in resultItem) {
                    html.push(this.renderCol(each, resultItem[each]));
                }
            } else {
                html.push(this.renderCol(each, result[each]));
            }
        }
        return html;
    }

    render() {
        const error = this.state.error;
        let colsHtml;
        if (error) {
            colsHtml =  this.renderCol('error', error);
        } else {
            colsHtml = this.renderCols();
        }

        return (
            <div className="tx-detail-container">
                <div className="tx-detail-panle">交易详情</div>
                <Row gutter={16} className="tx-detail-body">
                    {colsHtml}
                </Row>
            </div>
        );
    }
}
