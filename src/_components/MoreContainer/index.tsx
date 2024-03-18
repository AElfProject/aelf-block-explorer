import DetailContainer from '@_components/DetailContainer';
import IconFont from '@_components/IconFont';
import React, { MouseEventHandler } from 'react';

function MoreContainer({
  showMore,
  diver = false,
  onChange,
}: {
  showMore: boolean;
  diver?: boolean;
  onChange: MouseEventHandler;
}) {
  const detail = [
    {
      label: 'More Details ',
      value: (
        <div className="flex justify-start items-center" onClick={onChange}>
          <IconFont className="text-xs" type={showMore ? 'Less' : 'More'} />
          <span className="cursor-pointer text-link ml-1">Click to show {showMore ? 'less' : 'more'}</span>
        </div>
      ),
    },
  ];
  const infoList = diver
    ? [
        {
          label: 'divider1',
          value: 'divider',
        },
        ...detail,
      ]
    : detail;
  return <DetailContainer infoList={infoList} />;
}

export default React.memo(MoreContainer);
