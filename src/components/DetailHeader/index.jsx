/**
 * @file account detail header
 * @author atom-yang
 */
import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Tooltip,
  Divider,
} from 'antd';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';

const HeaderItem = (props) => {
  const {
    tip,
    name,
    desc,
  } = props;
  return (
    <Row gutter={16}>
      <Col span={4}>
        {tip ? (
          <Tooltip
            title={tip}
          >
            <QuestionCircleOutlined className="main-color" />
          </Tooltip>
        ) : null}
        <span className="gap-left-small">
          {name}
          :
        </span>
      </Col>
      <Col>
        {desc}
      </Col>
    </Row>
  );
};

HeaderItem.propTypes = {
  tip: PropTypes.string,
  name: PropTypes.string.isRequired,
  desc: PropTypes.node.isRequired,
};

HeaderItem.defaultProps = {
  tip: '',
};

const DetailHeader = (props) => {
  const {
    columns,
  } = props;
  return (
    <div className="detail-header">
      <h3>Overview</h3>
      <Divider />
      {columns.map((v) => (
        <Fragment key={v.name}>
          <HeaderItem {...v} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

DetailHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(HeaderItem.propTypes)).isRequired,
};

export default DetailHeader;
