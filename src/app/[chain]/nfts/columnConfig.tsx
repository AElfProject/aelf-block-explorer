import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import TokenTableCell from '@_components/TokenTableCell';
import { IToken, SortEnum } from '@_types/common';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { INFTsTableItem } from './type';
import Link from 'next/link';

export default function getColumns({ currentPage, pageSize, ChangeOrder, sort, chain }): ColumnsType<INFTsTableItem> {
  return [
    {
      title: '#',
      width: 128,
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Collection',
      width: 448,
      dataIndex: 'nftCollection',
      key: 'nftCollection',
      render: (collection: IToken) => (
        <Link href={`/${chain}/nft/${collection.symbol}`}>
          <TokenTableCell token={collection}>
            {collection.imageUrl && (
              <Image className="rounded-lg" src={collection.imageUrl} width={40} height={40} alt="img"></Image>
            )}
          </TokenTableCell>
        </Link>
      ),
    },
    {
      title: (
        <>
          <span className="mr-1">Item</span>
          <EPTooltip mode="dark" title="The total number of NFT items in the collection">
            <IconFont className="text-xs" type="question-circle" />
          </EPTooltip>
        </>
      ),
      width: 448,
      dataIndex: 'items',
      key: 'items',
      render: (text) => thousandsNumber(text),
    },
    {
      title: (
        <div className="flex cursor-pointer" onClick={ChangeOrder}>
          <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? 'scale-y-[-1]' : ''}`} type="Rank" />
          <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
            <div className="text-link">Holder</div>
          </EPTooltip>
        </div>
      ),
      width: 336,
      dataIndex: 'holders',
      key: 'holders',
      render: (text) => thousandsNumber(text),
    },
  ];
}
