import { IToken } from '@_types/common';
import { stringToDotString } from '@_utils/formatter';
import { useMemo } from 'react';
import TokenImage from '../TokenImage';

interface ITokenCellProps {
  token: Partial<IToken>;
}

export default function TokenCell({ token }: ITokenCellProps) {
  const symbol = useMemo(() => stringToDotString(token?.symbol, 25), [token?.symbol]);
  const name = useMemo(() => stringToDotString(token?.name, 25), [token?.name]);

  return (
    <div className="flex">
      <TokenImage token={token} />
      <div>{symbol || '--'}</div>
      {token?.name && <div>{`(${name})`}</div>}
    </div>
  );
}
