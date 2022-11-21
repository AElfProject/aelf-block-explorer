/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-19 18:00:07
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:06:00
 * @FilePath: /aelf-block-explorer/src/components/EventItem/index.tsx
 * @Description: show event item, you can encode and decode
 */
import React, { useState } from 'react';
import { Button, message, Input } from 'antd';
import { deserializeLog } from 'utils/utils';
import SaveAsFile from '../Save';
require('./EventItem.styles.less');
const { TextArea } = Input;
const DOWNLOAD_LIST = ['CodeCheckRequired'];
const EventItem = (props) => {
  const { Name } = props;
  const [result, setResult] = useState({ ...(props || {}) });
  const [hasDecoded, setHasDecoded] = useState(false);
  const [loading, setLoading] = useState(false);
  function decode() {
    setLoading(true);
    if (hasDecoded) {
      setResult({
        ...(props || {}),
      });
      setHasDecoded(false);
      setLoading(false);
    } else {
      deserializeLog(props)
        .then((res) => {
          if (Object.keys(res).length === 0) {
            throw new Error('Decode failed');
          }
          setResult(res);
          setLoading(false);
          setHasDecoded(true);
        })
        .catch(() => {
          message.error('Decode failed');
          setLoading(false);
        });
    }
  }
  return (
    <div className="event-item">
      {!DOWNLOAD_LIST.includes(Name) ? (
        <>
          <TextArea
            readOnly
            rows={6}
            spellCheck={false}
            value={JSON.stringify(result, null, 2)}
            className="event-item-text-area"
          />
          <Button
            type="primary"
            onClick={() => {
              decode();
            }}
            loading={loading}>
            {hasDecoded ? 'Encode' : 'Decode'}
          </Button>
        </>
      ) : (
        <SaveAsFile
          title="Download Log"
          files={[result]}
          fileName={Name || 'log'}
          buttonType="text"
          fileType=".json"
          className="save-btn"
        />
      )}
    </div>
  );
};

export default EventItem;
