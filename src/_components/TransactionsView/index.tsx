import IconFont from '@_components/IconFont';
import EPTooltip from '../EPToolTip/index';
import './index.css';
import Link from 'next/link';
import ConfirmStatus from '@_components/ConfirmedStatus';
export default function TransactionsView({ record }) {
  const PreviewCard = () => {
    return (
      <div className="preview-view">
        <div className="header p-2 flex justify-between items-center">
          <div className="title text-base-100 text-sm leading-[22px]">Preview</div>
          <div className="more text-xs leading-5">
            <Link className="text-xs inline-block leading-5" href={`tx/${record.transactionHash}`}>
              See More Details
            </Link>
          </div>
        </div>
        <div className="main">
          <div className="status mb-2">
            <div className="label">Status :</div>
            <div className="value">
              <ConfirmStatus status={record.status} />
            </div>
          </div>
          <div className="fee">
            <div className="label">Transaction Fee :</div>
            <div className="value text-xs leading-5 text-base-100">0.12543286 ELF</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <EPTooltip
      title={() => <PreviewCard />}
      className="transaction-tooltip"
      mode="light"
      trigger="click"
      pointAtCenter={false}>
      <div tabIndex={0} className="transaction-view">
        <IconFont type="view" />
      </div>
    </EPTooltip>
  );
}
