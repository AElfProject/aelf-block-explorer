/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 10:12:13
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 14:58:32
 * @FilePath: /aelf-block-explorer/src/components/Copy/index.tsx
 * @Description: copy content to clipboard
 */
import { useCopyToClipboard } from 'react-use';
import IconFont from 'components/IconFont';
export default function Copy({
  toCopy,
  children,
  className,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isCopied, setCopied] = useCopyToClipboard();
  return (
    <span onClick={() => setCopied(toCopy)} className={className}>
      {isCopied.value ? (
        'Copied'
      ) : (
        <>
          <IconFont type="copy" />
          {children}
        </>
      )}
    </span>
  );
}
