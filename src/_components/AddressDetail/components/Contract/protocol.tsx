import CodeBlock from '@_components/CodeBlock';
import IconFont from '@_components/IconFont';
import { handelCopy } from '@_utils/copy';
import { Button } from 'antd';
import { useState } from 'react';

export default function Protocol({
  value = JSON.stringify({
    pubkey:
      '0458ad2ec4d8944bff7f3ab7b56a90ffca784b0632bdf8c4a952da153b24b3fbbda5432f5ef293ab7ced791969f5fe02b0b5e6bc5af7ce074a9dc386c8dab0e6db',
    miningTime: {
      seconds: '1692602564',
      nanos: 407321800,
    },
    behaviour: 'UpdateTinyBlockInformation',
    blockHeight: '166146838',
    previousBlockHash: '3b5564ae3f6e60695326cf06bbe08d52b4810222f9aa9907c874bedcfb66cd2f',
  }),
}) {
  const [full, setFull] = useState(false);
  const fullCode = () => {
    setFull(!full);
  };
  const copy = () => {
    handelCopy(value);
  };
  return (
    <div className="contract-protocol-code px-4">
      <div className="source-header flex items-center justify-between py-4">
        <div className="flex items-center">
          <IconFont className="text-xs mr-1" type="protocol" />
          <span className="inline-block text-sm text-base-100 leading-[22px]">Contract Protocol Buffers </span>
          <IconFont className="text-xs ml-1" type="question-circle" />
        </div>
        <div className="view flex items-center">
          <Button
            className="view-button mx-2"
            icon={<IconFont className="!text-xs" type="view-copy" />}
            onClick={copy}
          />
          <Button
            className="view-button"
            icon={<IconFont className="!text-xs" type={!full ? 'viewer' : 'viewer-full'} />}
            onClick={fullCode}
          />
        </div>
      </div>
      <div className="code pb-4">
        <CodeBlock autoSize={full} value={value} />
      </div>
    </div>
  );
}
