/**
 * @file circle
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { If, Then, Else } from 'react-if';
import 'react-circular-progressbar/dist/styles.css';
import constants from '@redux/common/constants';

const {
  proposalActions,
} = constants;

const circleTypes = [
  ...Object.values(proposalActions),
  'Total',
];

const OUTER_STYLE_MAP = {
  [proposalActions.APPROVE]: buildStyles({
    pathColor: '#B0D3CE',
    trailColor: '#D7D4D7',
  }),
  [proposalActions.REJECT]: buildStyles({
    pathColor: '#F1A4B3',
    trailColor: '#D7D4D7',
  }),
  [proposalActions.ABSTAIN]: buildStyles({
    pathColor: '#9B9A9D',
    trailColor: '#D7D4D7',
  }),
  Total: buildStyles({
    pathColor: '#7E7D80',
    trailColor: '#D7D4D7',
  }),
};

const INNER_STYLE_MAP = {
  [proposalActions.APPROVE]: buildStyles({
    pathColor: '#05ac90',
    trailColor: 'transparent',
  }),
  [proposalActions.REJECT]: buildStyles({
    pathColor: '#d34a64',
    trailColor: 'transparent',
  }),
  [proposalActions.ABSTAIN]: buildStyles({
    pathColor: '#646464',
    trailColor: 'transparent',
  }),
  Total: buildStyles({
    pathColor: '#020002',
    trailColor: 'transparent',
  }),
};

const NORMAL_STYLE_MAP = {
  [proposalActions.APPROVE]: buildStyles({
    pathColor: '#05ac90',
    trailColor: '#D7D4D7',
  }),
  [proposalActions.REJECT]: buildStyles({
    pathColor: '#d34a64',
    trailColor: '#D7D4D7',
  }),
  [proposalActions.ABSTAIN]: buildStyles({
    pathColor: '#686568',
    trailColor: '#D7D4D7',
  }),
  Total: buildStyles({
    pathColor: '#020002',
    trailColor: '#D7D4D7',
  }),
};

const Circle = (props) => {
  const {
    isInProgress,
    value,
    threshold,
    type,
    maxValue,
    ...rest
  } = props;
  return (
    <If condition={isInProgress}>
      <Then>
        <CircularProgressbarWithChildren
          styles={OUTER_STYLE_MAP[type]}
          minValue={0}
          value={threshold}
          maxValue={maxValue}
          {...rest}
        >
          <CircularProgressbar
            value={value}
            minValue={0}
            styles={INNER_STYLE_MAP[type]}
            maxValue={maxValue}
          />
        </CircularProgressbarWithChildren>
      </Then>
      <Else>
        <CircularProgressbar
          value={value}
          minValue={0}
          styles={NORMAL_STYLE_MAP[type]}
          maxValue={maxValue}
          {...rest}
        />
      </Else>
    </If>
  );
};

Circle.propTypes = {
  // true to show two progress, false to show only one progress
  isInProgress: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  threshold: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  maxValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  type: PropTypes.oneOf(circleTypes).isRequired,
};

Circle.defaultProps = {
  isInProgress: false,
  threshold: 0,
  maxValue: 100,
};
export default Circle;
