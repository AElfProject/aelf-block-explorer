import { Tooltip } from 'antd';
import clsx from 'clsx';

export default function Method({ text, tip, truncate = true }: { text: string; tip: string; truncate?: boolean }) {
  return (
    <Tooltip title={tip} overlayClassName="table-item-tooltip-white">
      <div
        className={clsx(
          'border text-center inline-block box-border px-[15px] rounded border-D0 bg-F7 h-6 method',
          truncate && 'w-24',
        )}>
        <div className="truncate">{text}</div>
      </div>
    </Tooltip>
  );
}
