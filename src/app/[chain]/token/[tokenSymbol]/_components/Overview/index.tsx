import ContractToken from '@_components/ContractToken';
import OverviewCard from '@_components/OverviewCard';
import { IOverviewItem } from '@_components/OverviewCard/type';
import { thousandsNumber } from '@_utils/formatter';
import { ITokenDetail } from '../../type';
import NumberPercentGroup from '../NumberPercentGroup';
import { AddressType } from '@_types/common';
import { useParams } from 'next/navigation';

const TokenDetail = (chain): IOverviewItem[] => {
  return [
    {
      key: 'totalSupply',
      label: 'MAXIMUM SUPPLY',
      format: thousandsNumber,
      tooltip: 'The maximum number of tokens that will ever exist in the lifetime of the cryptocurrency.',
    },
    {
      key: 'circulatingSupply',
      label: 'CIRCULATING SUPPLY',
      format: thousandsNumber,
      tooltip:
        "Circulating Supply is the best approximation of the number of tokens that are circulating in the market and in the general public's hands.",
    },
    {
      key: 'holders',
      label: 'HOLDERS',
      render: (text, record) => <NumberPercentGroup number={text} percent={record['holderPercentChange24H']} />,
    },
    {
      key: 'transferCount',
      label: 'TOTAL TRANSFERS',
      format: thousandsNumber,
    },
    {
      key: 'price',
      label: 'PRICE',
      render: (text, record) => (
        <NumberPercentGroup decorator="$" number={text} percent={record['pricePercentChange24h']} />
      ),
    },
    {
      key: 'tokenContractAddress',
      label: 'CONTRACT',
      tooltip:
        'This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens.',
      render: (text) => (text ? <ContractToken address={text} type={AddressType.address} chainId={chain} /> : '--'),
    },
    {
      key: 'token',
      label: 'DECIMAL',
      render: (token) => (token.decimals && token.decimals !== 0 ? token.decimals : '--'),
    },
  ];
};

interface IDetailProps {
  data: Partial<ITokenDetail>;
}

export default function OverView({ data = {} }: IDetailProps) {
  const { chain } = useParams();
  const TokenDetailItems = TokenDetail(chain);
  return (
    <div className="mb-4">
      <OverviewCard items={TokenDetailItems} dataSource={data} breakIndex={4} />
    </div>
  );
}
