/**
 * @file bread
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Divider, Breadcrumb } from 'antd';
import { If, Then, Else } from 'react-if';
require('./index.less');

const Bread = (props) => {
  const { title, subTitle, breads } = props;
  return (
    <>
      <div className="address-bread">
        <div className="breadcrumb-title text-ellipsis">
          <h2>{title}</h2>
          {subTitle ? <span className="sub-title gap-left-small">#{subTitle}</span> : null}
        </div>
        <If condition={breads.length > 0}>
          <Then>
            <Breadcrumb>
              {breads.map((b) => (
                <Breadcrumb.Item key={b.title}>
                  <If condition={b.path === undefined}>
                    <Then>{b.title}</Then>
                    <Else>
                      <Link href={b.path || '/'}>{b.title}</Link>
                    </Else>
                  </If>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Then>
        </If>
      </div>
      <Divider className="address-bread-divider" />
    </>
  );
};

Bread.propTypes = {
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  breads: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ),
};
Bread.defaultProps = {
  subTitle: '',
  breads: [],
};

export default React.memo(Bread);
