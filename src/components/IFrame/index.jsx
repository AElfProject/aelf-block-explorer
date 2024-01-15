/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const IFrame = (props) => {
  const {
    url,
    onChange,
    messageType,
  } = props;
  const frame = useRef();

  useEffect(() => {
    function listener(event) {
      const {
        data,
        origin,
      } = event;
      if (origin === location.origin) {
        const {
          type,
          message,
        } = data;
        if (type === messageType) {
          const {
            height,
            href,
          } = message;
          if (height) {
            try {
              frame.current.style.height = height;
            } catch (e) {}
          }
          if (href) {
            onChange(href);
          }
        }
      }
    }
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  return (
    <iframe
      ref={frame}
      src={url}
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
      align="middle"
      scrolling="auto"
    />
  );
};

IFrame.propTypes = {
  url: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  messageType: PropTypes.string,
};

IFrame.defaultProps = {
  messageType: 'viewer',
};
export default IFrame;
