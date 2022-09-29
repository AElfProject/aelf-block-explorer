/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * @file Search.js
 * @author huangzongzhe
 */
import React, { PureComponent } from "react";
import { Input } from "antd";
import { withRouter } from "../../routes/utils";
import IconFont from "../IconFont";
import "./search.styles.less";
import { getHandleSearch } from "../../utils/search";

class Search extends PureComponent {


  constructor() {
    super()
    this.state = {
      content: "",
    };
  }

  handleSearch = (() => {
    const { navigate } = this.props
    const { content } = this.state
    getHandleSearch(navigate, content)()
  });

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({
      content: "",
    });
  };

  onChangeUserName = (e) => {
    this.setState({
      content: e.target.value,
    });
  };

  render() {
    const { content } = this.state;
    return (
      <div className='search-container'>
        <Input
          className='header-search'
          placeholder='Search by Address / Txn Hash...'
          value={content}
          onChange={this.onChangeUserName}
          ref={(node) => (this.userNameInput = node)}
          onPressEnter={this.handleSearch}
        />
        <span
          className='search-icon-container'
          onClick={this.handleSearch
          }
        >
          <IconFont type='Search' />
        </span>
      </div>
    );
  }
}

export default withRouter(Search);
