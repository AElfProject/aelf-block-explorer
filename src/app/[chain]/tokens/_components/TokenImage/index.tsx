'use client';
import { IToken } from '@_types/common';
import { useState } from 'react';

interface ITokenImageProps {
  token: Partial<IToken>;
}

export default function TokenImage({ token }: ITokenImageProps) {
  const [isErr, setErr] = useState<boolean>(false);
  // console.log('token-image-isErr-imgUrl', isErr, token?.imageUrl);

  return (
    <>
      {!isErr ? (
        <img className="size-6 rounded-xl" src={token?.imageUrl || ''} alt="logo" onError={() => setErr(true)} />
      ) : (
        <div className="size-6 rounded-xl text-center">{token?.symbol?.[0] || '-'}</div>
      )}
    </>
  );
}
