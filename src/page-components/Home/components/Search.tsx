import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useCallback } from 'react';
import IconFont from '../../../components/IconFont';
import { withRouter, NextRouter } from 'next/router';
import { getHandleSearch } from 'utils/search';
interface IProps {
  router: NextRouter;
}
function Search(props: IProps) {
  const [value, setValue] = useState('');
  const navigate = props.router.push;
  const handleSearch = getHandleSearch(navigate, value);

  const handleInput = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <div className="new-search">
      <Input
        value={value}
        placeholder="Search by Address / Txn Hash / Block"
        onChange={handleInput}
        onPressEnter={handleSearch}
      />
      <Button type="primary" onClick={handleSearch}>
        <IconFont type="Search" />
      </Button>
    </div>
  );
}

export default withRouter(Search);
