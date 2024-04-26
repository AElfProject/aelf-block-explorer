import Image from 'next/image';
import Link from 'next/link';
import Logo from 'public/next.svg';
import IconFont from '@_components/IconFont';
import { Collapse, CollapseProps, TabsProps, Dropdown } from 'antd';
// import OverViewDetail from './OverViewDetail';
// import OverViewProperty from './OverViewProperty';
import { CollectionDetailData } from '../type';

import '../detail.css';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';

export interface OverViewProps {
  overview: CollectionDetailData;
  // onHolderClick: () => void;
}
export default function OverView(props: OverViewProps) {
  const { overview } = props;
  return (
    <div className="collection-overview-wrap">
      <div className="collection-overview-header">{overview.nftCollection.name}</div>
      <div className="collection-overview-body">
        <h2 className="flex items-center">Overview</h2>
        <div className="collection-overview-data">
          <ul className="collection-overview-left">
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <IconFont type="question-circle" />
                </span>
                ITEMS
              </div>
              <div className="des">{overview.items}</div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <IconFont type="question-circle" />
                </span>
                HOLDERS
              </div>
              <div className="desc">{overview.holders}</div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">TOTAL TRANSFERS</div>
              <div className="desc">{overview.totalTransfers}</div>
            </li>
          </ul>
          <ul className="collection-overview-right">
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <IconFont type="question-circle" />
                </span>
                CONTRACT
              </div>
              <div className="desc">
                <ContractToken address={overview.contractAddress} type={AddressType.address} chainId="AELF" />
              </div>
            </li>
            <li className="collection-overview-data-item">
              <div className="title">
                <span className="icon">
                  <IconFont type="question-circle" />
                </span>
                FLOOR PRICE
              </div>
              <div className="desc">307</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
