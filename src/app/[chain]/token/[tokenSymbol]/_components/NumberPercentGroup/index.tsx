import { thousandsNumber } from '@_utils/formatter';
import { Typography } from 'aelf-design';
import { Flex } from 'antd';
import { useMemo } from 'react';

const { Text } = Typography;
interface INumberPercentGroupProps {
  number: string | number;
  percent: string | number;
  decorator?: string;
}

export default function NumberPercentGroup({ number, percent, decorator }: INumberPercentGroupProps) {
  const renderPercent = useMemo(() => {
    const percentNum = Number(percent);
    const isGteZero = percentNum >= 0;
    if (Number.isNaN(percentNum)) return <Text>{'(--)'}</Text>;
    return (
      <>
        <Text
          style={{
            color: isGteZero ? '#00A186' : '#FF4D4F',
          }}>{`(${isGteZero ? '+' : ''}${thousandsNumber(percentNum)}%)`}</Text>
      </>
    );
  }, [percent]);

  return (
    <Flex gap={4}>
      <Text>
        {decorator}
        {thousandsNumber(number)}
      </Text>
      {renderPercent}
    </Flex>
  );
}
