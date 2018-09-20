import React from "react";
import { List, Avatar } from "antd";
import { AutoSizer, List as VList } from "react-virtualized";

import "./infoList.styles.less";

export default class InfoList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderItem = ({ key, index }) => {
    const { dataSource } = this.props;
    const item = dataSource[index];
    return (
      <List.Item key={key}>
        <List.Item.Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={<a href="https://ant.design"> {item.title} </a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    );
  };

  render() {
    const { dataSource } = this.props;
    const vlist = ({ height, width }) => (
      <VList
        autoHeight
        height={height}
        overscanRowCount={2}
        rowCount={dataSource.length}
        rowHeight={73}
        rowRenderer={this.renderItem}
        width={width}
      />
    );

    return (
      <List>
        <AutoSizer>{vlist}</AutoSizer>
      </List>
    );
  }
}
