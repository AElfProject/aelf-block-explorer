import EPTooltip from '@_components/EPToolTip';
import { IToken } from '@_types/common';
import { stringToDotString } from '@_utils/formatter';
import { FontWeightEnum, Typography } from 'aelf-design';
import { Flex } from 'antd';
import { useMemo } from 'react';

const { Text } = Typography;

interface ITokenCellProps extends React.PropsWithChildren {
  token: Partial<IToken>;
}

export default function TokenCell({ token, children }: ITokenCellProps) {
  const symbol = useMemo(() => stringToDotString(token?.symbol, 25) || '--', [token?.symbol]);
  const name = useMemo(() => stringToDotString(token?.name, 25) || '--', [token?.name]);

  return (
    <Flex gap={4} align="center">
      {children}
      <Text size="small" fontWeight={FontWeightEnum.Bold}>
        <EPTooltip mode="dark" title={token?.name}>
          {name}
        </EPTooltip>
      </Text>
      {symbol && (
        <Text className="!text-[#858585]" size="small">
          <EPTooltip mode="dark" title={token?.symbol}>
            {`(${symbol})`}
          </EPTooltip>
        </Text>
      )}
    </Flex>
  );
}
