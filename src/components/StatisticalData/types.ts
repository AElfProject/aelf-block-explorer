import { CSSProperties } from 'react';

export interface IProps {
  data: Data;
  spinning: boolean;
  style?: CSSProperties;
  tooltip?: string;
  inline?: boolean;
}

interface Data {
  termEndTime: TermEndTime;
  currentNodesAmount: CurrentNodesAmount;
  currentVotesAmount: CurrentNodesAmount;
  currentMiningReward: CurrentMiningReward;
}

interface CurrentMiningReward {
  id: number;
  title: string;
  span: number;
  isRender: boolean;
  num: Num;
}

interface Num {
  key: string;
  ref?: any;
  props: Props;
  owner?: any;
  store: any;
}

interface Props {
  dividends: Dividends;
}

interface Dividends {
  eLF: number;
}

interface CurrentNodesAmount {
  id: number;
  title: string;
  span: number;
  num: number;
}

interface TermEndTime {
  id: number;
  title: string;
  isCountdown: boolean;
  resetTime: number;
  span: number;
  num: string;
}
export interface IState {
  arr: Arr[];
}

interface Arr {
  id: number;
  title: string;
  isCountdown?: boolean;
  resetTime: number;
  span: number;
  num: Num | number | string;
  isRender?: boolean;
}
