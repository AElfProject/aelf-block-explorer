/**
 * @file voteInfomation
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import Svg from '../Svg/Svg';
import getHexNumber from '../../utils/getHexNumber';
import ContainerRichard from '../ContainerRichard/ContainerRichard';

export default class voteInfomation extends PureComponent {
    constructor(props) {
        super(props);
        this.informationTimer;
        this.state = {
            information: [{
                title: 'Voter Turnout',
                info: '-',
                icon: 'people_counting'
            },
            {
                title: 'Ballot Count',
                info: '-',
                icon: 'poll'
            },
            {
                title: 'Bonus Pool',
                info: '-',
                icon: 'fenhong_icon'
            }],
            consensus: null,
            constacts: this.props.contracts

        };

    }

    static getDerivedStateFromProps(props, state) {
        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contracts !== this.props.contracts) {
            this.getInformation();
        }
    }


    getInformation() {
        const {contracts, information} = this.state;
        console.log('start');
        information[0].info = getHexNumber(contracts.consensus.GetVotesCount().return).toLocaleString();
        information[1].info = getHexNumber(contracts.consensus.GetTicketsCount().return).toLocaleString();
        information[2].info = getHexNumber(contracts.consensus.QueryCurrentDividends().return).toLocaleString();
        this.setState({
            information: information || []
        });
        this.informationTimer = setTimeout(() => {
            this.getInformation();
        }, 60000);
    }

    componentWillUnMount() {
        clearTimeout(this.informationTimer);
    }

    renderVoteInformation() {
        const VoteHtml = this.state.information.map(item =>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}
                     className='vote-info-con'
                     key={item.title + Math.random()}
                >
                    <ContainerRichard type='small'>
                        <div
                            className='vote-info-content-con'
                        >
                            <div className='vote-info-title'>
                                <Svg
                                    icon={item.icon}
                                    style={{width: '20px', height: '20px', display: 'inline-block', margin: '5px 5px'}}
                                />
                                {item.title}
                            </div>
                            <div className='vote-info-num'>{item.info.toLocaleString() || '-'}</div>
                        </div>
                    </ContainerRichard>
                </Col>
        );
        return VoteHtml;
    }


    render() {
        const renderVoteInformationHTML = this.renderVoteInformation()
        return (
            <div className='Voting-information'>
                <Row type="flex" justify="space-between">
                    {renderVoteInformationHTML}
                </Row>
            </div>
        );
    }
}