/*
 * @author: Peterbjx
 * @Date: 2023-08-17 14:37:04
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:18:42
 * @Description: confirmed or unconfirmed
 */
import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { useMemo } from 'react';

enum StatusEnum {
  Confirmed = 'Confirmed',
  unconfrimed = 'unconfrimed',
}
export default function Status({ status }) {
  return useMemo(() => {
    return (
      <div
        className={clsx(
          'h-6 px-2 flex border rounded items-center',
          status === StatusEnum.Confirmed ? 'bg-confirm-bg border-confirm-br' : 'border-color-divider bg-F7',
        )}>
        <IconFont className="text-xs mr-1" type={status === StatusEnum.Confirmed ? 'confirmed' : 'unconfirmed'} />
        <span
          className={clsx(
            'block text-xs leading-5 font-medium',
            status === StatusEnum.Confirmed ? 'text-confirm' : 'text-base-200',
          )}>
          {status}
        </span>
      </div>
    );
  }, [status]);
}
