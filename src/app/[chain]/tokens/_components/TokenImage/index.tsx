'use client';
import { IToken } from '@_types/common';
import { FontWeightEnum, Typography } from 'aelf-design';
import Image from 'next/image';
interface ITokenImageProps {
  token: Partial<IToken>;
}

const { Text } = Typography;

export default function TokenImage({ token }: ITokenImageProps) {
  return (
    <>
      {token?.imageUrl ? (
        <Image className="size-6 rounded-xl" src={token.imageUrl} alt="logo" width={24} height={24} />
      ) : (
        <div className="flex size-6 items-center justify-center rounded-xl border-[1px] bg-white">
          <Text size="small" fontWeight={FontWeightEnum.Bold}>
            {token?.symbol?.[0] || '--'}
          </Text>
        </div>
      )}
    </>
  );
}
