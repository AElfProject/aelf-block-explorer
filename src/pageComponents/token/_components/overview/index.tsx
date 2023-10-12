import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import './index.css';
type OverviewItemType = {
  label: string | JSX.Element;
  value: React.ReactNode;
  key: string;
};
export interface IOverviewProps {
  leftItems: OverviewItemType[];
  rightItems: OverviewItemType[];
  title: string;
}
const clsxPrefix = 'overview-two-columns-container';
export default function Overview({ leftItems, rightItems, title }: IOverviewProps) {
  const { isMobileSSR: isMobile } = useMobileContext();
  return (
    <div className={clsx(clsxPrefix, isMobile && `${clsxPrefix}-mobile`)}>
      <div className="title">{title}</div>
      <div className="content">
        <div className="overview-left">
          {leftItems.map((item) => {
            return (
              <div key={item.key} className="list-items">
                <div className="item-label font10px">{item.label}</div>
                <div className="item-value">{item.value}</div>
              </div>
            );
          })}
        </div>
        {!isMobile && <div className="middle"></div>}
        <div className="overview-right">
          {rightItems.map((item) => {
            return (
              <div key={item.key} className="list-items">
                <div className="item-label font10px">{item.label}</div>
                <div className="item-value">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
