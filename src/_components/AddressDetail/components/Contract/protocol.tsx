import CodeBlock from '@_components/CodeBlock';
import IconFont from '@_components/IconFont';
import { handelCopy } from '@_utils/copy';
import { Button } from 'aelf-design';
import { useState } from 'react';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import useResponsive from '@_hooks/useResponsive';

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
  const { isMobile } = useResponsive();
  const fullCode = () => {
    setFull(!full);
  };
  const copy = () => {
    handelCopy(value);
  };
  return (
    <div className="contract-protocol-code px-4">
      <div
        className={clsx(isMobile && 'flex-col !items-start', 'source-header flex items-center justify-between py-4')}>
        <div className="flex items-center">
          <IconFont className="mr-1 text-xs" type="protocol" />
          <span className="inline-block text-sm leading-[22px] text-base-100">Contract Protocol Buffers </span>
          <IconFont className="ml-1 text-xs" type="question-circle" />
        </div>
        <div className={clsx('view flex items-center', isMobile && 'mt-2')}>
          <Button
            className={clsx('view-button mx-2', isMobile && 'ml-0')}
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
