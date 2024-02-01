import IconFont from '@_components/IconFont';
import { Dropdown, Tooltip } from 'aelf-design';
import Image from 'next/image';
import { ItemSymbolDetailOverview } from "../type"

export interface OverViewPropertyProps {
  overview: ItemSymbolDetailOverview,
}

export default function OverViewDetail(props: OverViewPropertyProps) {
  const { overview } = props;
  return (
    <ul className="nft-detail-ul nft-detail-block-wrap">
      {
        overview.properties.list.map((item, index) => {
          return <li className="nft-detail-block" key={index}>
            <h1>{item.title}</h1>
            <h2>
              <Tooltip title={item.value}>{item.value}</Tooltip>
            </h2>
          </li>
        })
      }
    </ul>
  )
}