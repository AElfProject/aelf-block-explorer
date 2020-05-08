/**
 * @file dividend
 * @author atom-yang
 */
import React from "react";
import {
    Dropdown,
    Button,
    Menu,
    Icon
} from 'antd';
import {
    If,
    Then,
    Else
} from 'react-if';

const Dividends = props => {
    const {
        dividends
    } = props;
    const keys = Object.keys(dividends);
    const defaultKey = dividends.ELF !== undefined ? 'ELF' : keys[0] || 'ELF';
    return (
        <If condition={keys.length > 1}>
            <Then>
                <Dropdown
                    overlay={(
                        <Menu>
                            {
                                keys
                                    .map(key => (
                                        <Menu.Item key={key}>
                                            {dividends[key]}&nbsp;{key}
                                        </Menu.Item>
                                    ))
                            }
                        </Menu>
                    )}
                >
                    <Button>
                        {dividends[defaultKey] || 0}&nbsp;{defaultKey}
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            </Then>
            <Else>
                <div>
                    {dividends[defaultKey] || 0}&nbsp;{defaultKey}
                </div>
            </Else>
        </If>
    );
};

export default Dividends;
