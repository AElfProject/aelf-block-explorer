import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { useCallback } from 'react';
import IconFont from '../../../components/IconFont';
import { get, isAElfAddress } from '../../../utils/axios';
import { useMemo } from 'react';
import { INPUT_ZERO_TIP, TXS_BLOCK_API_URL } from '../../../constants';
import { withRouter, NextRouter } from 'next/router';
import { getHandleSearch } from 'utils/search';
interface IProps {
  router: NextRouter;
}
function Search(props: IProps) {
  const [value, setValue] = useState('');
  const navigate = props.router.push;
  const handleSearch = getHandleSearch(navigate, value);

  const handleInput = useCallback((e: any) => {
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
