import React, { useCallback, useEffect, useState } from 'react';
import { VIEWER_GET_FILE } from 'constants/viewerApi';
import { get } from 'utils/axios';
import ContractViewer from '../../AddressDetail/components/Contract/Contract';
import { useRouter } from 'next/router';

export default function Contract({ address, headers }) {
  const nav = useRouter().push;
  const [contractInfo, setContractInfo] = useState(undefined);

  const fetchFile = useCallback(async () => {
    const result = await get(VIEWER_GET_FILE, { address });
    if (result?.code === 0) {
      const { data } = result;
      setContractInfo(data);
    } else {
      nav('/search-failed');
    }
  }, [address]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  return <ContractViewer contractInfo={contractInfo} isShow headers={headers} />;
}
