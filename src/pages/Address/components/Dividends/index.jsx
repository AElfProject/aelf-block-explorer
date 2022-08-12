/**
 * @file dividend
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  Button,
  Menu,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  If,
  Then,
  Else,
} from 'react-if';

const Dividends = (props) => {
  const {
    dividends,
    defaultSymbol,
  } = props;
  if (!dividends) {
    return (<div>-</div>);
  }
  // console.log('dividends:', dividends);
  const keys = Object.keys(dividends);
  // eslint-disable-next-line no-nested-ternary
  const defaultKey = defaultSymbol !== undefined
    ? defaultSymbol : (dividends.ELF !== undefined ? 'ELF' : keys[0] || 'ELF');
  return (
    <If condition={keys.length > 1}>
      <Then>
        <Dropdown
          overlay={(
            <Menu>
              {
                keys
                  .map((key) => (
                    <Menu.Item key={key}>
                      {dividends[key]}
                      {key}
                    </Menu.Item>
                  ))
              }
            </Menu>
          )}
        >
          <Button>
            {dividends[defaultKey] || 0}
            {defaultKey}
            <DownOutlined />
          </Button>
        </Dropdown>
      </Then>
      <Else>
        <div>
          {dividends[defaultKey] || 0}
          {defaultKey}
        </div>
      </Else>
    </If>
  );
};

Dividends.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dividends: PropTypes.object.isRequired,
  defaultSymbol: PropTypes.string,
};

Dividends.defaultProps = {
  defaultSymbol: 'ELF',
};

export default React.memo(Dividends);
