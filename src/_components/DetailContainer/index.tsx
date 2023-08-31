/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:09:00
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:16:23
 * @Description: Detail Container
 */
import IconFont from '@_components/IconFont';
import { Tooltip, Divider } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';

export default function DetailContainer({
  infoList,
}: {
  infoList: { label: string; value: React.ReactNode | string; tip?: React.ReactNode | string }[];
}) {
  const { isMobileSSR: isMobile } = useMobileContext();
  return (
    <div className="wrap basic px-4">
      {infoList.map((item) => {
        return item.value === 'divider' ? (
          <Divider key={item.label} className="!my-3 border-color-divider" />
        ) : (
          <div key={item.label} className={clsx(isMobile ? 'flex flex-col' : 'row flex items-start', 'py-2')}>
            <div className={clsx('label flex items-center w-[312px] mr-4', isMobile && 'mb-2')}>
              {item.tip && (
                <Tooltip title={item.label} overlayClassName="table-item-tooltip-white">
                  <IconFont className="text-sm" style={{ marginRight: '4px' }} type="question-circle" />
                </Tooltip>
              )}
              <div className="label text-xs text-base-200 leading-5">{item.label} :</div>
            </div>
            <div className="value break-words text-base-100 text-xs flex-1 leading-5">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
