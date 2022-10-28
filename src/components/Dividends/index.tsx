/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-17 16:40:55
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:02:32
 * @FilePath: /aelf-block-explorer/src/components/Dividends/index.tsx
 * @Description: dividends
 */
import React from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { If, Then, Else } from 'react-if';
import { DownOutlined } from '@ant-design/icons';
import { numberFormatter } from 'utils/formater';

const Dividends = (props) => {
  const { dividends, defaultSymbol, useButton = true, ...rest } = props;
  const keys = Object.keys(dividends);
  const defaultKey =
    defaultSymbol !== undefined ? defaultSymbol : dividends.ELF !== undefined ? 'ELF' : keys[0] || 'ELF';
  return (
    <If condition={keys.length > 1}>
      <Then>
        <Dropdown
          overlay={
            <Menu>
              {keys.map((key) => (
                <Menu.Item key={key}>
                  {dividends[key]}&nbsp;{key}
                </Menu.Item>
              ))}
            </Menu>
          }
          {...rest}>
          {useButton ? (
            <Button>
              {dividends[defaultKey] || 0}&nbsp;{defaultKey}
              <DownOutlined />
            </Button>
          ) : (
            <div>
              {dividends[defaultKey] || 0}&nbsp;{defaultKey}
              <DownOutlined />
            </div>
          )}
        </Dropdown>
      </Then>
      <Else>
        <div {...rest}>
          {numberFormatter(dividends[defaultKey]) || 0}&nbsp;{defaultKey}
        </div>
      </Else>
    </If>
  );
};

export default React.memo(Dividends);
