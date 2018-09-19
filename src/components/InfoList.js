import React from "react";
import { List, Icon, Avatar } from "antd";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import VList from "react-virtualized/dist/commonjs/List";
import { get } from "../utils";

import "./infoList.styles.less";

export default class InfoList extends React.PureComponent {
  state = {
    data: []
  };

  async componentDidMount() {
    const data = await get();
    this.setState({
      data
    });
  }

  renderItem({ index }) {
    const { data } = this.state;
    const item = data[index];
    return (
      <List.Item key={item.blockId}>
        <List.Item.Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={<a href="https://ant.design">{item.title}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    );
  }

  render() {
    const { data } = this.state;
    const vlist = ({
      height,
      isScrolling,
      onChildScroll,
      scrollTop,
      onRowsRendered,
      width
    }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={77}
        rowRenderer={this.renderItem}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    );
    const autoSize = ({
      height,
      isScrolling,
      onChildScroll,
      scrollTop,
      onRowsRendered
    }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width
          })
        }
      </AutoSizer>
    );
    return <List>{data.length > 0 && <WindowScroller />}</List>;
  }
}
