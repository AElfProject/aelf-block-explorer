import IconFont from '@_components/IconFont';
import { CollectionDetailData } from '../type';

import '../detail.css';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { addSymbol, divDecimals, thousandsNumber } from '@_utils/formatter';
import EPTooltip from '@_components/EPToolTip';

export interface OverViewProps {
  overview: CollectionDetailData;
  // onHolderClick: () => void;
}
export default function OverView(props: OverViewProps) {
  const { chain } = useParams();
  const { overview } = props;
  return (
    <div className="collection-overview-wrap">
      <div className="collection-overview-header">
        <span>{overview?.nftCollection?.name}</span>
        <span className="ml-1 text-base-200">({overview?.nftCollection?.symbol})</span>
      </div>
      <div className="collection-overview-body">
        <h2 className="flex items-center">Overview</h2>
        <div className="collection-overview-data">
          <ul className="collection-overview-left">
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <EPTooltip title="The total number of NFT items in the collection" mode="dark" pointAtCenter={true}>
                    <IconFont type="question-circle" />
                  </EPTooltip>
                </span>
                ITEMS
              </div>
              <div className="des">{thousandsNumber(overview.items)}</div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">HOLDERS</div>
              <div className="desc">{thousandsNumber(overview.holders)}</div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">TOTAL TRANSFERS</div>
              <div className="desc">{thousandsNumber(overview.transferCount)}</div>
            </li>
          </ul>
          <ul className="collection-overview-right">
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <EPTooltip
                    title="This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens."
                    mode="dark"
                    pointAtCenter={true}>
                    <IconFont type="question-circle" />
                  </EPTooltip>
                </span>
                CONTRACT
              </div>
              <div className="desc item-center flex">
                <IconFont className="mr-1 text-xs" type="Contract" />
                <ContractToken
                  address={overview.tokenContractAddress}
                  type={AddressType.address}
                  chainId={chain as TChainID}
                />
              </div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <EPTooltip
                    title="The lowest listing price of an NFT item in the collection"
                    mode="dark"
                    pointAtCenter={true}>
                    <IconFont type="question-circle" />
                  </EPTooltip>
                </span>
                FLOOR PRICE
              </div>
              <div className="desc">
                <span>${overview.floorPriceOfUsd}</span>
                <span className="ml-1 text-xs leading-5 text-base-200">
                  {overview.floorPrice || overview.floorPrice === 0
                    ? `(${addSymbol(divDecimals(overview.floorPrice))})`
                    : '-'}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
