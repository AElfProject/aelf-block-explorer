import Image from 'next/image';
import Link from 'next/link';
import Logo from 'public/next.svg';
import IconFont from '@_components/IconFont';
import { Collapse, CollapseProps, TabsProps, Dropdown } from 'antd';
import OverViewDetail from './OverViewDetail';
import OverViewProperty from './OverViewProperty';
import { ItemSymbolDetailOverview } from '../type'

export interface OverViewProps {
  overview: ItemSymbolDetailOverview,
  onHolderClick: () => void,
}
export default function OverView(props: OverViewProps) {
  const { overview, onHolderClick } = props;
  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      showArrow: false,
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont type="document" />
            <span>Details</span>
          </div>
          <div className="nft-detail-label-right">
            <IconFont type="Down" />
          </div>
        </div>
      ),
      children: <OverViewDetail overview={overview} onHolderClick={onHolderClick} />,
    },
    {
      key: '2',
      showArrow: false,
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont type="box" />
            <span>Properties &lpar;{overview.properties.total}&rpar;</span>
          </div>
          <div className="nft-detail-label-right">
            <IconFont type="Down" />
          </div>
        </div>
      ),
      children: (
        <OverViewProperty overview={overview} />
      ),
    },
  ];
  if (overview.description) {
    collapseItems.push({
      key: '3',
      showArrow: false,
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont type="page" />
            <span>Description</span>
          </div>
          <div className="nft-detail-label-right">
            <IconFont type="Down" />
          </div>
        </div>
      ),
      children: (
        <div className="nft-detail-ul flex">
          <input type="checkbox" id="exp" className="nft-detail-txt-checkbox peer" />
          <div className="nft-detail-txt peer-checked:!line-clamp-none">
            <label className="nft-detail-txt-more" htmlFor="exp">
              See More
            </label>
            {overview.description}
          </div>
        </div>
      ),
    })
  }
  return (
    <div className="ntf-overview-wrap">
      <div className="nft-image-wrap">
        <Image src={overview.item.imageUrl} alt="" className="nft-image" />
      </div>
      <div className="nft-detail-wrap">
        <div className="nft-title-wrap">
          <h1 className="nft-title">{overview.item.name}</h1>
          <div className="nft-thumb">
            <div className="nft-thumb-image-wrap">
              <Image className="object-contain" fill src={overview.nftCollection.imageUrl} alt="" />
            </div>
            <Link href="/" className="text-link">
              {overview.nftCollection.name}
            </Link>
          </div>
        </div>
        <div className="nft-detail">
          <Collapse items={collapseItems} ghost />
        </div>
      </div>
    </div>
  )
}