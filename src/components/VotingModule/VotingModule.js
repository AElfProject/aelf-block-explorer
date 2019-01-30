/**
 * @file VotingModule
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Modal, Spin} from 'antd';
import MyVote from './MyVote/MyVote';
import VoteTable from './VoteTable/VoteTable';
import Svg from '../../components/Svg/Svg';
import Vote from './Vote/Vote';
import Redeem from './Redeem/Redeem';
import './VotingModule.less';
import {NONE} from 'apisauce';
import VotingRecord from './VotingRecord/VotingRecord';
import getHexNumber from '../../utils/getHexNumber';

export default class VotingModule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet,
            session: null,
            isVote: false,
            isRedeem: false,
            confirmLoading: false,
            votingAmount: null,
            myVote: null,
            txId: null,
            nodeName: null,
            publicKey: null,
            showVote: true,
            showVotingRecord: false,
            showMyVote: false,
            refresh: 0,
            isRefresh: false,
            consensus: null,
            contracts: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.consensus !== state.consensus) {
            return {
                consensus: props.consensus
            };
        }

        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.consensus !== this.props.consensus) {
            const {consensus} = this.state;
            if (consensus) {
                consensus.GetCurrentRoundNumber((error, result) => {
                    consensus.GetTermNumberByRoundNumber(getHexNumber(result.return), (error, result) => {
                        this.setState({
                            session: getHexNumber(result.return)
                        });
                    });
                });
            }
        }
    }

    handleClose() {
        this.setState({
            isVote: false,
            isRedeem: false
        });
    }

    showVote() {
        this.setState({
            isVote: true
        });
    }

    obtainInfo(nodeName, publicKey, myVote, txId) {
        this.setState({
            nodeName,
            publicKey,
            myVote,
            txId
        });
    }

    showRedeem() {
        this.setState({
            isRedeem: true
        });
    }
    showNodeList() {
        this.setState({
            showMyVote: false,
            showVotingRecord: false,
            showVote: true
        });
    }

    showMyVote() {
        this.setState({
            showMyVote: true,
            showVotingRecord: false,
            showVote: false
        });
    }

    showVotingRecord() {
        this.setState({
            showMyVote: false,
            showVotingRecord: true,
            showVote: false
        });
    }

    onRefresh() {
        const {consensus, isRefresh, refresh} = this.state;
        if (!isRefresh) {
            this.setState({
                isRefresh: true
            });

            consensus.GetCurrentRoundNumber((error, result) => {
                consensus.GetTermNumberByRoundNumber(getHexNumber(result.return), (error, result) => {
                    this.setState({
                        session: getHexNumber(result.return),
                        refresh: refresh + 1
                    });
                });
            });
        }
    }

    endRefresh() {
        this.setState({
            isRefresh: false
        });
    }

    getVoteTable() {
        const {consensus, currentWallet, refresh, showVote, contracts} = this.state;
        return (
            <VoteTable
                style={this.state.showVote ? {display: 'block'} : {display: 'none'}}
                showVoteFn={this.showVote.bind(this)}
                showRedeem={this.showRedeem.bind(this)}
                handleClose={this.handleClose.bind(this)}
                obtainInfo={this.obtainInfo.bind(this)}
                currentWallet={currentWallet}
                showMyVote={this.showMyVote.bind(this)}
                endRefresh={this.endRefresh.bind(this)}
                refresh={refresh}
                showVote={showVote}
                consensus={consensus}
                contracts={contracts}
            />
        );
    }

    getMyVote() {
        const {consensus, contracts, refresh, currentWallet, showMyVote} = this.state;
        return (
            <MyVote
                style={this.state.showMyVote ? {display: 'block'} : {display: 'none'}}
                showVote={this.showVote.bind(this)}
                showRedeem={this.showRedeem.bind(this)}
                handleClose={this.handleClose.bind(this)}
                obtainInfo={this.obtainInfo.bind(this)}
                endRefresh={this.endRefresh.bind(this)}
                currentWallet={currentWallet}
                refresh={refresh}
                consensus={consensus}
                contracts={contracts}
                showMyVote={showMyVote}
            />
        );
    }

    getVotingRecord() {
        const {consensus, currentWallet, refresh, showVotingRecord} = this.state;
        return (
            <VotingRecord
                style={this.state.showVotingRecord ? {display: 'block'} : {display: 'none'}}
                currentWallet={currentWallet}
                refresh={refresh}
                consensus={consensus}
                showVotingRecord={showVotingRecord}
                endRefresh={this.endRefresh.bind(this)}
            />
        );
    }

    render() {
        const {isVote, isRedeem, contracts} = this.state;
        const voteTable = this.getVoteTable();
        const myVote = this.getMyVote();
        const votingRecord = this.getVotingRecord();
        return (
            <div className='voting-module' ref='voting'>
                <Spin
                    spinning={this.state.isRefresh}
                    tip='Loading...'
                    size='large'
                >
                <div className='voting-module-head'>
                    <Row type='flex' align='middle'>
                        <Col
                            xs={10} sm={10} md={10} lg={9} xl={16}
                        >
                            Vote · The {this.state.session} session
                        </Col>
                        <Col
                            xs={4} sm={4} md={4} lg={4} xl={2}
                        >
                            <div className='node-list'
                                onClick={this.showNodeList.bind(this)}
                                style={this.state.showVote ? {color: '#52ff00', borderColor: '#52ff00'} : {}}
                            >
                                Node list
                            </div>
                        </Col>
                        <Col
                            xs={4} sm={4} md={4} lg={4} xl={2}
                        >
                            <div className='my-vote'
                                onClick={this.showMyVote.bind(this)}
                                style={this.state.showMyVote ? {color: '#52ff00', borderColor: '#52ff00'} : {}}
                            >
                                My vote
                            </div>
                        </Col>
                        <Col
                            xs={4} sm={4} md={4} lg={6} xl={3}
                        >
                            <div className='voting-record'
                                onClick={this.showVotingRecord.bind(this)}
                                style={this.state.showVotingRecord ? {color: '#52ff00', borderColor: '#52ff00'} : {}}
                            >
                                Voting record
                            </div>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={1} xl={1}>
                            <Svg
                                className={this.state.isRefresh ? 'refresh-animate' : ''}
                                icon='refresh'
                                style={{width: '60px', height: '45px', float: 'right'}}
                                onClick={this.onRefresh.bind(this)}
                            />
                        </Col>
                    </Row>
                </div>
                <div className='voting-module-module'>
                    {voteTable}
                    {myVote}
                    {votingRecord}
                </div>
                </Spin>
                <Modal
                    visible={isVote}
                    title='Vote'
                    closable={false}
                    footer={NONE}
                    destroyOnClose={true}
                >
                    <Vote
                        nodeName={this.state.nodeName}
                        publicKey={this.state.publicKey}
                        handleClose={this.handleClose.bind(this)}
                        onRefresh={this.onRefresh.bind(this)}
                        contracts={contracts}
                    />
                </Modal>
                <Modal
                    visible={isRedeem}
                    title='Redeem'
                    closable={false}
                    footer={NONE}
                    destroyOnClose={true}
                >
                    <Redeem
                        nodeName={this.state.nodeName}
                        publicKey={this.state.publicKey}
                        handleClose={this.handleClose.bind(this)}
                        txId={this.state.txId}
                        myVote={this.state.myVote}
                        contracts={contracts}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                </Modal>
            </div>
        );
    }
}
