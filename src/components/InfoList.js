import React from "react";
import { List } from "antd";
import SmoothScrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";
import Scrollbar from "react-smooth-scrollbar";

SmoothScrollbar.use(OverscrollPlugin);

import "./infoList.styles.less";

export default class InfoList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.scrollbar = this.$container.scrollbar;
  }

  render() {
    const { dataSource, renderItem } = this.props;

    return (
      <Scrollbar ref={c => (this.$container = c)}>
        <List
          dataSource={dataSource}
          renderItem={renderItem}
          className="infoList"
        />
      </Scrollbar>
    );
  }
}
