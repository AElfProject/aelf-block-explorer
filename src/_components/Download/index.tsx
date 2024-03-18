import IconFont from '@_components/IconFont';
import { message } from 'antd';
import { Button } from 'aelf-design';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { getZip } from '@_utils/file';

export default function Download({ files, fileName, fileType = '.zip', ...parmas }) {
  const [loading, setIsLoading] = useState(false);
  const download = async () => {
    setIsLoading(true);
    try {
      const blob = fileType === '.zip' ? await getZip(files) : new Blob([JSON.stringify(files)], { type: 'text/json' });

      saveAs(blob, `${fileName}${fileType}`);
    } catch (e) {
      message.error('Download failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="view-button"
      loading={loading}
      icon={<IconFont className="!text-xs" type="Download" />}
      onClick={download}
      {...parmas}
    />
  );
}
