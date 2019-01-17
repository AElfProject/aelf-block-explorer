/**
 * @file ResourceTransacitionDetails
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Table} from 'antd';
import './ResourceTransacitionDetails.less';

const PAGE_SIZE = 10;
const page = 0;

export default class ResourceTransacitionDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pagination: {
                showQuickJumper: true,
                total: 0,
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    // const setTop = this.refs.voting.offsetTop;
                    // window.scrollTo(0, setTop);
                }
            }
        };
    }

    getDetailsColumn() {
        const detailsColumn = [
            {
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
                align: 'center'
            },
            {
                title: 'Resource type',
                dataIndex: 'resourceType',
                key: 'resourceType',
                align: 'center'
            },
            {
                title: 'Direction',
                dataIndex: 'direction',
                key: 'direction',
                align: 'center'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                align: 'center'
            },
            {
                title: 'Number',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: 'ELF Number',
                dataIndex: 'elfNumber',
                key: 'elfNumber',
                align: 'center'
            },
            {
                title: 'Service Charge',
                dataIndex: 'serviceCharge',
                key: 'serviceCharge',
                align: 'center'
            }
        ];
        return detailsColumn;
    }


    getTestData() {
        let data = [
            {
                time: '2019-01-01',
                resourceType: 'RAM',
                direction: 'Buy',
                price: 12.666,
                number: 1000,
                elfNumber: 1000,
                serviceCharge: 20
            },
            {
                time: '2019-01-01',
                resourceType: 'RAM',
                direction: 'Sell',
                price: 12.666,
                number: 1000,
                elfNumber: 1000,
                serviceCharge: 20
            }
        ];

        return data;
    }

    render() {
        const detailsColumn = this.getDetailsColumn();
        const {pagination} = this.state;
        return (
            <div className='transaction-details'>
                {/* <div className='transaction-details-head'>
                    Transaction Details
                </div> */}
                <Table
                    columns={detailsColumn}
                    pagination={pagination}
                    dataSource={this.getTestData()}
                />
            </div>
        );
    }
}
