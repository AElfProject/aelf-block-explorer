import React, { ReactNode } from 'react';

export function isReactNode(value: any): value is ReactNode {
  return typeof value === 'string' || typeof value === 'number' || React.isValidElement(value);
}
