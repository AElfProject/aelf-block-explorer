import React, { useState } from 'react';
import Image from 'next/image';

const ImageWithFallback = (props) => {
  const { src, fallbackSrc, ...rest } = props;
  const [flag, setFlag] = useState(false);

  return (
    <>
      {flag ? (
        fallbackSrc
      ) : (
        <Image
          {...rest}
          src={src}
          width="24"
          height="24"
          alt="icon"
          onError={() => {
            setFlag(true);
          }}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
