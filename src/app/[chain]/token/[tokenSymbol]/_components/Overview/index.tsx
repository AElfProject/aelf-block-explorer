import ContractToken from '@_components/ContractToken';
import OverviewCard from '@_components/OverviewCard';
import { IOverviewItem } from '@_components/OverviewCard/type';
import { thousandsNumber } from '@_utils/formatter';
import { ITokenDetail } from '../../type';
import NumberPercentGroup from '../NumberPercentGroup';
import { AddressType } from '@_types/common';

const TokenDetailItems: IOverviewItem[] = [
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
    key: 'priceInUsd',
    label: 'PRICE',
    render: (text, record) =>
      record['pricePercentChange24h'] && record['pricePercentChange24h'] !== 0 ? (
        <NumberPercentGroup decorator="$" number={text} percent={record['pricePercentChange24h']} />
      ) : (
        '--'
      ),
  },
  {
    key: 'contractAddress',
    label: 'CONTRACT',
    tooltip:
      'This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens.',
    render: (text) => (text ? <ContractToken address={text} type={AddressType.address} chainId="AELf" /> : '--'),
  },
  {
    key: 'decimals',
    label: 'DECIMAL',
    render: (text) => (text && text !== 0 ? text : '--'),
  },
];

interface IDetailProps {
  data: Partial<ITokenDetail>;
}

export default function OverView({ data = {} }: IDetailProps) {
  return (
    <div className="mb-4">
      <OverviewCard items={TokenDetailItems} dataSource={data} breakIndex={4} />
    </div>
  );
}