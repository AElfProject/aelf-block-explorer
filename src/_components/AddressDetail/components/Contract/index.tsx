import SourceCode from './sourceCode';
import Protocol from './protocol';
export default function Contract() {
  return (
    <div className="contract-container">
      <div className="contract-header border-b border-color-divider flex pb-4 mx-4">
        <div className="list-items w-[197px] mr-4 pr-4">
          <div className="item-label leading-[18px] text-base-200 font10px">CONTRACT NAME</div>
          <div className="item-value text-sm leading-[22px] text-base-100">Name001</div>
        </div>
        <div className="list-items pl-4">
          <div className="item-label leading-[18px] text-base-200 font10px">CONTRACT VERSION</div>
          <div className="item-value text-sm leading-[22px] text-base-100">1.0.0.0</div>
        </div>
      </div>
      <SourceCode />
      <Protocol />
    </div>
  );
}
