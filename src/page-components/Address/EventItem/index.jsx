/**
 * @file event item
 * @author atom-yang
 */
import React, { useState } from 'react';
import { Button, message, Input } from 'antd';
import PropTypes from 'prop-types';
import { deserializeLog } from 'utils/utils';

const { TextArea } = Input;

const EventItem = (props) => {
  const { data, name, address } = props;
  const [result, setResult] = useState({ ...(data || {}) });
  const [hasDecoded, setHasDecoded] = useState(false);
  const [loading, setLoading] = useState(false);
  function decode() {
    setLoading(true);
    if (hasDecoded) {
      setResult({
        ...(data || {}),
      });
      setHasDecoded(false);
      setLoading(false);
    } else {
      deserializeLog(data, name, address)
        .then((res) => {
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
      <TextArea
        readOnly
        rows="6"
        spellCheck={false}
        value={JSON.stringify(result, null, 2)}
        className="event-item-text-area gap-bottom"
      />
      <Button onClick={decode} loading={loading}>
        {hasDecoded ? 'Encode' : 'Decode'}
      </Button>
    </div>
  );
};

EventItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default EventItem;
