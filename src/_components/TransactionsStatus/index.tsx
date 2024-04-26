import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { memo } from 'react';
import { TransactionStatus, TransactionStatusText } from '@_api/type';
function Status({ status }: { status: TransactionStatus }) {
  return (
    <div
      className={clsx(
        'flex h-6 items-center rounded border px-2',
        status === TransactionStatus.Mined && 'border-confirm-br bg-confirm-bg',
        (status === TransactionStatus.Failed || status === TransactionStatus.Conflict) &&
          'border-pink_stroke bg-pink_fill',
      )}>
      {status === TransactionStatus.Mined && <IconFont className="mr-1 text-xs" type="confirmed" />}
      {(status === TransactionStatus.Failed || status === TransactionStatus.Conflict) && (
        <IconFont className="mr-1 text-xs" type="fail-close" />
      )}
      <span
        className={clsx(
          'block text-xs font-medium leading-5',
          status === TransactionStatus.Mined && 'text-confirm',

          (status === TransactionStatus.Failed || status === TransactionStatus.Conflict) && 'text-rise-red',
        )}>
        {TransactionStatusText[TransactionStatus[status]]}
      </span>
    </div>
  );
}

export default memo(Status);
