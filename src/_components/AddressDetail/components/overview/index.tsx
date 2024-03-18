import clsx from 'clsx';
import './index.css';
type OverviewItemType = {
  label: string;
  value: React.ReactNode;
};
export interface IOverviewProps {
  items: OverviewItemType[];
  title: string;
  className?: string;
}

export default function Overview({ items, className, title }: IOverviewProps) {
  return (
    <div className={clsx(className, 'overview-container')}>
      <div className="title">{title}</div>
      <div className="overview-list">
        {items.map((item) => {
          return (
            <div key={item.label} className="list-items">
              <div className="item-label font10px">{item.label}</div>
              <div className="item-value">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
