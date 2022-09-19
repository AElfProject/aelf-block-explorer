import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VIEWER_GET_FILE } from "../../../api/url";
import { get } from "../../../utils";
import ContractViewer from "../../AddressDetail/components/Contract/Contract";

export default function Contract({ address }) {
  const nav = useNavigate();
  const [contractInfo, setContractInfo] = useState(undefined);

  const fetchFile = useCallback(async () => {
    const result = await get(VIEWER_GET_FILE, { address });
    if (result?.code === 0) {
      const { data } = result;
      setContractInfo(data);
    } else {
      nav("/search-failed");
    }
  }, [address]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  return <ContractViewer contractInfo={contractInfo} isShow />;
}
