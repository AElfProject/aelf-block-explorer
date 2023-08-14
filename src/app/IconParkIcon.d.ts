import { HTMLAttributes } from 'react';

/**
 * @description: iconpark icon
 */
interface IconParkIcon extends HTMLAttributes<IconParkIcon> {
  name?: string;
  size?: string;
  width?: string;
  height?: string;
  rtl?: boolean;
  spin?: boolean;
  color?: string;
  stroke?: string;
  fill?: string;
  class?: string;
  style?: string | unknown;
}

declare global {
  interface HTMLElementTagNameMap {
    'iconpark-icon': IconParkIcon;
  }
  // when you use React with typescript
  namespace JSX {
    interface IntrinsicElements {
      'iconpark-icon': IconParkIcon;
    }
  }
}
