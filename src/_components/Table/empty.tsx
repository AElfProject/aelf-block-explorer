import { ReactNode, useMemo } from 'react';
import tableEmptyImg from '../../../public/table-empty-data.png';
import TableEmptyInternet from '../../../public/table-empty-internet.png';
import TableEmptySearch from '../../../public/table-empty-search.png';
import Image from 'next/image';
import clsx from 'clsx';

interface CommonEmptyProps {
  type?: 'nodata' | 'search' | 'internet';
  desc?: ReactNode;
  size?: 'large' | 'middle' | 'small';
  className?: string;
}

export default function CommonEmpty({ type, desc, className, size = 'large' }: CommonEmptyProps) {
  const sizeStyle = useMemo(() => {
    if (size === 'large') {
      return 'size-large-120';
    } else if (size === 'middle') {
      return 'size-middle-100';
    } else {
      return 'size-small-80';
    }
  }, [size]);

  const emptyStatus = useMemo(() => {
    const typesMap = {
      nodata: {
        src: tableEmptyImg,
        desc: 'noData',
      },
      search: {
        src: TableEmptySearch,
        desc: 'noSearch',
      },
      internet: {
        src: TableEmptyInternet,
        desc: 'No Internet',
      },
    };
    let curType;
    if (!type) {
      curType = typesMap['search']; //default
    } else {
      curType = typesMap[type];
    }
    return (
      <div className={clsx('empty-placeholder', sizeStyle, className)}>
        {curType.src && <Image alt="empty" src={curType.src} />}
        {curType.desc && <span>{desc || curType.desc}</span>}
      </div>
    );
  }, [className, desc, sizeStyle, type]);

  return emptyStatus;
}
