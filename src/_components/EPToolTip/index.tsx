import { Tooltip, TooltipProps } from 'antd';
import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.css';
import { useMobileContext } from '@app/pageProvider';
import { TooltipPlacement } from 'antd/es/tooltip';

interface IToolTip
  extends Omit<TooltipProps, 'children' | 'color' | 'overlayClassName' | 'trigger' | 'arrow' | 'placement'> {
  pointAtCenter?: boolean;
  children: ReactNode;
  mode: 'light' | 'dark';
  placement?: TooltipPlacement;
  trigger?: 'click' | 'hover';
}

export default function EPTooltip({
  children,
  pointAtCenter = true,
  trigger,
  placement = 'topLeft',
  mode = 'dark',
  ...params
}: IToolTip) {
  const { isMobileSSR: isMobile } = useMobileContext();
  return (
    <Tooltip
      overlayClassName={clsx(mode === 'light' ? 'tooltip-light' : 'tooltip-dark')}
      color={mode === 'dark' ? '#1D2A51' : '#FFFFFF'}
      trigger={trigger || (isMobile ? 'click' : 'hover')}
      arrow={{ pointAtCenter: pointAtCenter }}
      placement={placement}
      {...params}>
      {children}
    </Tooltip>
  );
}