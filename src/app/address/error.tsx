/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 10:40:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 10:40:24
 * @Description: error UI
 */
'use client';

import { useEffect } from 'react';
import { Button } from 'antd';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </Button>
    </div>
  );
}
