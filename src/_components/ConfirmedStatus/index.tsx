/*
 * @author: Peterbjx
 * @Date: 2023-08-17 14:37:04
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:18:42
 * @Description: confirmed or unconfirmed
 */
import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { memo } from 'react';
import { StatusEnum } from '@_types/status';
function Status({ status }) {
  return (
    <div
      className={clsx(
        'h-6 px-2 flex border rounded',
        (status === StatusEnum.Confirmed || status === StatusEnum.Success) && 'bg-confirm-bg border-confirm-br',
        status === StatusEnum.Unconfrimed && 'border-color-divider bg-F7',
        status === StatusEnum.Fail && 'bg-pink_fill border-pink_stroke',
      )}>
      {(status === StatusEnum.Confirmed || status === StatusEnum.Success) && (
        <IconFont className="text-xs mr-1" type="confirmed" />
      )}
      {status === StatusEnum.Unconfrimed && <IconFont className="text-xs mr-1" type="unconfirmed" />}
      {status === StatusEnum.Fail && <IconFont className="text-xs mr-1" type="fail-close" />}
      <span
        className={clsx(
          'block text-xs leading-5 font-medium',
          (status === StatusEnum.Confirmed || status === StatusEnum.Success) && 'text-confirm',
          status === StatusEnum.Unconfrimed && 'text-base-200',
          status === StatusEnum.Fail && 'text-rise-red',
        )}>
        {status}
      </span>
    </div>
  );
}

export default memo(Status);
