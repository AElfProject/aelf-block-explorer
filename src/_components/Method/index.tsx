import EPTooltip from '@_components/EPToolTip';
import clsx from 'clsx';

export default function Method({ text, tip, truncate = true }: { text: string; tip: string; truncate?: boolean }) {
  return (
    <EPTooltip title={tip} mode="dark" pointAtCenter={false}>
      <div
        className={clsx(
          'border leading-6 border-box text-center inline-block box-border px-[15px] rounded border-D0 bg-F7 h-6 method',
          truncate && 'w-24',
        )}>
        <div className="truncate">{text}</div>
      </div>
    </EPTooltip>
  );
}
