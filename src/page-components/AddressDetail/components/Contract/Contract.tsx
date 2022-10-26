import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Reader from '../Reader/Reader';
import SaveAsFile from 'components/Save';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
require('./Contract.styles.less');

interface IContractInfo {
  contractName: string;
  files: string;
  address: string;
  version: string;
}
interface IHistory {
  codeHash: string;
  version: string;
}
interface IProps {
  contractInfo?: IContractInfo;
  codeHash?: string;
  history?: IHistory[];
  isShow: boolean;
  headers: any;
}
export default function Contract({
  contractInfo = { contractName: '-', files: '', address: '-', version: '-' },
  codeHash,
  history,
  isShow,
  headers,
}: IProps) {
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  return (
    <div className={clsx('contract-pane', isMobile && 'mobile')}>
      <section className="contract-info">
        <p>
          <span className="label">Contract Name</span>
          <span className="value">{contractInfo.contractName === '-1' ? '-' : contractInfo.contractName}</span>
        </p>
        <p>
          <span className="label">Compiler Version</span>
          <span className="value">
            {codeHash ? history?.find((i) => i.codeHash === codeHash)?.version : contractInfo.version}
          </span>
        </p>
        <p>
          <span className="label">
            Contract Info
            <SaveAsFile files={JSON.parse(contractInfo.files || '[]')} fileName={contractInfo.address || 'contract'} />
          </span>
        </p>
      </section>
      <section className="contract-code">
        <Reader contractInfo={contractInfo} isShow={isShow} headers={headers} />
      </section>
    </div>
  );
}