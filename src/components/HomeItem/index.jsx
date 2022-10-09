/**
 * @file home list item
 * @author atom-yang
 */
import React from "react";
import moment from "moment";
import { Row, Col } from "antd";
import { If, Then, Else } from "react-if";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.less";

function formatTime(time) {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
}

const Item = (props) => {
  const { name, text, link } = props;
  return (
    <div className='home-item-title text-ellipsis__simple'>
      <If condition={!!name}>
        <Then>
          <span className='home-item-title-name'>
            {name}
            :&nbsp;
          </span>
        </Then>
      </If>
      <If condition={!!link}>
        <Then>
          <Link
            className='text-ellipsis__simple home-title-link'
            to={link}
            title={text}
          >
            {text}
          </Link>
        </Then>
        <Else>
          <span className='text-ellipsis__simple'>{text}</span>
        </Else>
      </If>
    </div>
  );
};

const descItemPropsType = PropTypes.shape({
  name: PropTypes.string,
  text: PropTypes.any.isRequired,
  link: PropTypes.string,
});

Item.propTyps = descItemPropsType;

const HomeItem = (props) => {
  const { title, middleLeftTitle, middleRightTitle, time, bottomTitle } = props;
  return (
    <Row className='home-item'>
      <Col span={24} className='gap-bottom-small'>
        <Col span={12}>
          <Item {...title} />
        </Col>
      </Col>
      <Col sm={24} md={10}>
        <Item {...middleLeftTitle} />
      </Col>
      <Col sm={24} md={4} />
      <Col sm={24} md={10} className='home-item-right'>
        <Item {...middleRightTitle} />
      </Col>
      <Col sm={24} md={10} className='gap-top-small'>
        <span className='home-item-time'>{formatTime(time)}</span>
      </Col>
      <Col sm={24} md={4} className='gap-top-small' />
      <Col sm={24} md={10} className='gap-top-small home-item-right'>
        <Item {...bottomTitle} />
      </Col>
    </Row>
  );
};

HomeItem.propTypes = {
  title: descItemPropsType.isRequired,
  time: PropTypes.string.isRequired,
  middleLeftTitle: descItemPropsType,
  middleRightTitle: descItemPropsType,
  bottomTitle: descItemPropsType,
};

export default React.memo(HomeItem);
