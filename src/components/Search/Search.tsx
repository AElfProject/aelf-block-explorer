/**
 * @file Search.js
 * @author huangzongzhe
 */
import React, { PureComponent } from 'react';
import { NextRouter, withRouter } from 'next/router';
import { Input } from 'antd';
import IconFont from '../IconFont';
import { getHandleSearch } from 'utils/search';
require('./search.styles.less');

interface IProps {
  router: NextRouter;
}
class Search extends PureComponent<
  IProps,
  {
    content: string;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  handleSearch = () => {
    const navigate = this.props.router.push;
    const { content } = this.state;
    getHandleSearch(navigate, content)();
  };
  userNameInput;
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({
      content: '',
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
      <div className="search-container">
        <Input
          className="header-search"
          placeholder="Search by Address / Txn Hash..."
          value={content}
          onChange={this.onChangeUserName}
          ref={(node) => (this.userNameInput = node)}
          onPressEnter={this.handleSearch}
        />
        <span className="search-icon-container" onClick={this.handleSearch}>
          <IconFont type="Search" />
        </span>
      </div>
    );
  }
}

export default withRouter(Search);