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
        dividends,
        defaultSymbol,
        ...rest
    } = props;
    const keys = Object.keys(dividends);
    const defaultKey = defaultSymbol !== undefined ? defaultSymbol : (dividends.ELF !== undefined ? 'ELF' : keys[0] || 'ELF');
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
                    {...rest}
                >
                    <Button>
                        {dividends[defaultKey] || 0}&nbsp;{defaultKey}
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            </Then>
            <Else>
                <div {...rest}>
                    {dividends[defaultKey] || 0}&nbsp;{defaultKey}
                </div>
            </Else>
        </If>
    );
};

export default Dividends;
