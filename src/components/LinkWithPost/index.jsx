/**
 * @file Link
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import { sendMessage } from '../../common/utils';

const LinkWithPost = (props) => {
  const {
    href,
    target,
    children,
    rel,
    ...rest
  } = props;

  function handleClick() {
    if (target === '_self') {
      sendMessage({
        href,
      });
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
};

LinkWithPost.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  target: PropTypes.oneOf([
    '_blank',
    '_self',
    '_parent',
    '_top',
  ]),
  rel: PropTypes.string,
};

LinkWithPost.defaultProps = {
  target: '_self',
  rel: '',
};

export default LinkWithPost;
