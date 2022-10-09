/**
 * @file arrow pagination
 * @author atom-yang
 */
import React from 'react';
import {
  Button,
} from 'antd';

const ButtonGroup = Button.Group;

const Arrow = (props) => {
  const {
    pre,
    next,
    preDisabled = false,
    nextDisabled = false,
  } = props;
  return (
    <ButtonGroup className="arrow-pagination">
      <Button
        size="small"
        icon="left"
        disabled={preDisabled}
        onClick={pre}
      />
      <Button
        size="small"
        icon="right"
        disabled={nextDisabled}
        onClick={next}
      />
    </ButtonGroup>
  );
};

export default Arrow;
