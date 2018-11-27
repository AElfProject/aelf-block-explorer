import React from "react";
import { Row, Col } from "antd";
import { isEmpty, map } from "lodash";
import { aelf, formatKey } from "../../utils";

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

        if (formatKey(key) === 'ExecutedInBlock') {
            return;
        }

        return (
            <div key={key + Math.random()}>
                <Col span={6} style={{height: 'auto'}}>{formatKey(key)}</Col>
                <Col span={18} style={{height: 'auto', wordBreak: 'break-all'}}>{value}</Col>
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
            <div className="tx-block-detail-container basic-container">
                <div className="tx-block-detail-panle">Overview</div>
                <Row className="tx-block-detail-body">
                    {colsHtml}
                </Row>

                <div className="basic-bottom-blank"></div>
            </div>
        );
    }
}
