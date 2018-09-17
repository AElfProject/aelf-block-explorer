import React from "react";
import { List, Icon, Avatar } from "antd";
import { Link } from "react-router-dom";

import "./infoList.styles.less";

const data = [
  {
    title: "Ant Design Title 1"
  },
  {
    title: "Ant Design Title 2"
  },
  {
    title: "Ant Design Title 3"
  },
  {
    title: "Ant Design Title 4"
  },
  {
    title: "Ant Design Title 1"
  },
  {
    title: "Ant Design Title 2"
  },
  {
    title: "Ant Design Title 3"
  },
  {
    title: "Ant Design Title 4"
  },
  {
    title: "Ant Design Title 1"
  },
  {
    title: "Ant Design Title 2"
  },
  {
    title: "Ant Design Title 3"
  },
  {
    title: "Ant Design Title 4"
  }
];

const InfoListItem = item => (
  <List.Item>
    <List.Item.Meta
      avatar={
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      }
      title={<a href="https://ant.design">{item.title}</a>}
      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
    />
  </List.Item>
);

const InfoList = props => {
  const { iconType, title, href, ...listProps } = props;
  return (
    <div className="infoList">
      <div className="infoList-panel-heading">
        <h2 className="infoList-panel-title">
          <Icon type={iconType} theme="outlined" />
          {title}
        </h2>
        {/* <Link to={href}>View All</Link> */}
      </div>
      <List
        className="list-container"
        dataSource={data}
        itemLayout="horizontal"
        renderItem={InfoListItem}
      />
    </div>
  );
};

export default InfoList;
