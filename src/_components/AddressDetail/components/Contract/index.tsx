import SourceCode from './sourceCode';
import Protocol from './protocol';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
export default function Contract() {
  const { isMobile } = useMobileAll();
  return (
    <div className="contract-container">
      <div className={clsx(isMobile && 'flex-col', 'contract-header mx-4 flex border-b border-color-divider pb-4')}>
        <div className="list-items mr-4 w-[197px] pr-4">
          <div className="item-label font10px leading-[18px] text-base-200">CONTRACT NAME</div>
          <div className="item-value text-sm leading-[22px] text-base-100">Name001</div>
        </div>
        <div className={clsx(isMobile && 'mt-4 !pl-0', 'list-items pl-4')}>
          <div className="item-label font10px leading-[18px] text-base-200">CONTRACT VERSION</div>
          <div className="item-value text-sm leading-[22px] text-base-100">1.0.0.0</div>
        </div>
      </div>
      <SourceCode />
      <Protocol />
    </div>
  );
}
