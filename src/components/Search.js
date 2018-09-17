import React, { PureComponent } from "react";
import { Input, Icon } from "antd";

import "./search.styles.less";

export default class Search extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    content: ""
  };

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ content: "" });
  };

  onChangeUserName = e => {
    this.setState({ content: e.target.value });
  };

  handleSearch = e => {
    const value = e.target.value || "";
    if (!value.trim()) {
      return;
    }

    this.props.handleSearch(value);
  };

  render() {
    const { content } = this.state;
    const suffix = content ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    return (
      <Input
        className="header-search"
        placeholder="Enter your username"
        prefix={<Icon type="search" className="search-icon" />}
        suffix={suffix}
        value={content}
        onChange={this.onChangeUserName}
        ref={node => (this.userNameInput = node)}
        onPressEnter={this.handleSearch}
      />
    );
  }
}
