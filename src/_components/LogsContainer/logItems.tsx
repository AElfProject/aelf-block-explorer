import React, { useState } from 'react';
import { ILogsProps } from './type';
import CodeBlock from '@_components/CodeBlock';
import { Button } from 'antd';
import './logItem.css';
function LogItems({ data }: { data: ILogsProps }) {
  const [result] = useState(
    JSON.stringify(
      {
        ...data,
        decode: undefined,
      },
      null,
      2,
    ),
  );
  const [hasDecoded, setHasDecoded] = useState<boolean>(false);
  function decode() {
    setHasDecoded(!hasDecoded);
  }
  return (
    <div className="log-item">
      {
        <>
          <CodeBlock value={hasDecoded ? data.decode : result} />
          <Button type="primary" className="log-button mt-2 text-xs leading-5" onClick={decode}>
            {hasDecoded ? 'Encode' : 'Decode'}
          </Button>
        </>
      }
    </div>
  );
}

export default React.memo(LogItems);
