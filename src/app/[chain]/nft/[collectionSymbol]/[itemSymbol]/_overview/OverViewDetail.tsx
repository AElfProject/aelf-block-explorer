import IconFont from '@_components/IconFont';
import { Dropdown, Tooltip } from 'aelf-design';
import Image from 'next/image';
import { ItemSymbolDetailOverview } from "../type"
import { IsMain } from '@_utils/isMainNet';
import Link from 'next/link';
import { useParams } from 'next/navigation'

export interface OverViewDetailProps {
  overview: ItemSymbolDetailOverview,
  onHolderClick: () => void,
}

export default function OverViewDetail(props: OverViewDetailProps) {
  const params = useParams<CollectionSymbol & ItemSymbol>()
  const { overview, onHolderClick } = props;
  return (
    <ul className="nft-detail-ul">
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <IconFont type="question-circle" />
          <span>Holders:</span>
        </div>
        <div className="nft-detail-item-right text-link cursor-pointer" onClick={onHolderClick}>
          {overview.holders}
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <IconFont type="question-circle" />
          <span>Owners:</span>
        </div>
        <div className="nft-detail-item-right">
          {overview.owner.length === 1 && <span>{overview.owner[0]}</span>}
          {overview.owner.length > 1 && <Dropdown menu={{
            items: overview.owner.map(item => {
              return {
                key: item,
                label: <span>{item}</span>
              }
            })
          }} trigger={['click']}>
            <span>{overview.owner.length}Owners <IconFont type="Down" /></span>
          </Dropdown>
          }
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <IconFont type="question-circle" />
          <span>Issuer:</span>
        </div>
        <div className="nft-detail-item-right">
          {overview.issuer.length === 1 && <span>{overview.issuer[0]}</span>}
          {overview.issuer.length > 1 && <Dropdown menu={{
            items: overview.issuer.map(item => {
              return {
                key: item,
                label: <span>{item}</span>
              }
            })
          }} trigger={['click']}>
            <span>{overview.issuer.length}Issuers <IconFont type="Down" /></span>
          </Dropdown>
          }
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <IconFont type="question-circle" />
          <span>Token Symbol:</span>
        </div>
        <div className="nft-detail-item-right">
          {overview.tokenSymbol}
        </div>
      </li>
      <li className="nft-detail-item">
        <div className="nft-detail-item-left">
          <IconFont type="question-circle" />
          <span>Quantity:</span>
        </div>
        <div className="nft-detail-item-right">
          {overview.quantity}
        </div>
      </li>
      {IsMain &&
        <li className="nft-detail-item">
          <div className="nft-detail-item-left">
            <IconFont type="question-circle" />
            <span>Marketplaces:</span>
          </div>
          <div className="nft-detail-item-right">

            <span className='flex'>
              <Image src={overview.marketPlaces.marketLogo} alt='' width={20} height={20} />
              <Link href={`eforest.finance/detail/buy/${params.collectionSymbol}/${params.itemSymbol}`}>
                <Tooltip title={`view on ${overview.marketPlaces.marketName}`}>
                  {overview.marketPlaces.marketName}
                </Tooltip>
              </Link>
            </span>
          </div>
        </li>
      }
    </ul>
  )
}