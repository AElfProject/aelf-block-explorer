/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:09:00
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:16:23
 * @Description: Detail Container
 */
import IconFont from '@_components/IconFont';
import { Divider } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import EPTooltip from '@_components/EPToolTip';
import useResponsive from '@_hooks/useResponsive';

export default function DetailContainer({
  infoList,
}: {
  infoList: { label: string; value: React.ReactNode | string; tip?: React.ReactNode | string }[];
}) {
  const { isMobile } = useResponsive();
  return (
    <div className="wrap basic px-4">
      {infoList.map((item) => {
        return item.value === 'divider' ? (
          <Divider key={item.label} className="!my-3 border-color-divider" />
        ) : (
          <div key={item.label} className={clsx(isMobile ? 'flex flex-col' : 'row flex items-start', 'py-2')}>
            <div className={clsx('label mr-4 flex w-[312px] items-center', isMobile && 'mb-2')}>
              {item.tip && (
                <EPTooltip title={item.label} mode="dark">
                  <IconFont className="text-sm" style={{ marginRight: '4px' }} type="question-circle" />
                </EPTooltip>
              )}
              <div className="label text-xs leading-5 text-base-200">{item.label} :</div>
            </div>
            <div className="value flex-1 break-words text-xs leading-5 text-base-100">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
