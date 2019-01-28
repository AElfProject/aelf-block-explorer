/**
 * @file VotingRecord
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Table} from 'antd';
import './VotingRecord.less';
import hexCharCodeToStr from '../../../utils/hexCharCodeToStr';
import getPublicKey from '../../../utils/getPublicKey';
import dayjs from 'dayjs';

let page = 0;
let pageSize = 10;
export default class VotingRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet,
            refresh: 0,
            loading: false,
            pagination: {
                showQuickJumper: true,
                total: 0,
                showTotal: total => `Total ${total} items`
            },
            data: null,
            contracts: null,
            consensus: null,
            showVotingRecord: false
        };
    }

    votingRecordsData = async (params = {}) => {
        this.setState({
            loading: true
        });
        const {currentWallet, consensus} = this.state;
        const {page, pageSize, pagination} = params;
        let dataList = [];
        if (currentWallet) {
            if (currentWallet.address === '') {
                return dataList;
            }
        }
        else {
            return dataList;
        }

        const key = getPublicKey(currentWallet.publicKey);
        consensus.GetPageableTicketsHistoriesToFriendlyString(key, page, pageSize, (error, result) => {
            const ticketsHistoriesData = JSON.parse(hexCharCodeToStr(result.return)).Values;
            const historiesNumber = JSON.parse(hexCharCodeToStr(result.return)).HistoriesNumber;
            pagination.total = parseInt(historiesNumber, 10);
            ticketsHistoriesData.map((item, index) => {
                let data = {
                    key: page + index + 1,
                    serialNumber: page + index + 1,
                    nodeName: item.CandidateAlias || '-',
                    type: item.Type || '-',
                    number: item.VotesNumber || '-',
                    state: item.State ? 'success' : 'failed',
                    time: dayjs(item.Timestamp).format('YYYY-MM-DD') || '-'
                };
                dataList.push(data);
            });
            this.props.endRefresh();
            this.setState({
                data: dataList,
                pagination,
                loading: false
            });
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.refresh !== state.refresh) {
            return {
                refresh: props.refresh
            };
        }

        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }

        if (props.consensus !== state.consensus) {
            return {
                consensus: props.consensus
            };
        }

        if (props.showVotingRecord !== state.showVotingRecord) {
            return {
                showVotingRecord: props.showVotingRecord
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            const {consensus, showVotingRecord, pagination} = this.state;
            if (consensus && showVotingRecord) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordsData(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                );
            }
        }

        if (prevProps.refresh !== this.props.refresh) {
            const {consensus, showVotingRecord, pagination} = this.state;
            if (consensus && showVotingRecord) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordsData(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                );
            }
        }

        if (prevProps.consensus !== this.props.consensus) {
            const {consensus, showVotingRecord, pagination} = this.state;
            if (consensus && showVotingRecord) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordsData(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                );
            }
        }

        if (prevProps.showVotingRecord !== this.props.showVotingRecord) {
            const {consensus, showVotingRecord, pagination} = this.state;
            if (consensus && showVotingRecord) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordsData(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                );
            }
        }
    }

    handleTableChange = pagination => {
        let pageOption = {...this.state.pagination};
        pageOption.current = pagination.current;
        page = 10 * (pagination.current - 1);
        pageSize = page + 10;
        this.votingRecordsData({
            page,
            pageSize,
            pagination: pageOption
        });
    };

    getVotingInfoColumn() {
        const voteInfoColumn = [
            {
                title: 'Serial number',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                align: 'center'
            },
            {
                title: 'Node name',
                dataIndex: 'nodeName',
                key: 'nodeName',
                align: 'center'
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: 'Number',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                align: 'center'
            },
            {
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
                align: 'center'
            }
        ];
        return voteInfoColumn;
    }

    render() {
        const {pagination, data, loading} = this.state;
        const {handleTableChange} = this;
        const getVotingInfoColumn = this.getVotingInfoColumn();
        return (
            <div className='Voting-Record' style={this.props.style} ref='voting'>
                <Table
                    columns={getVotingInfoColumn}
                    pagination={pagination}
                    dataSource={data}
                    onChange={handleTableChange}
                    loading={loading}
                />
            </div>
        );
    }
}