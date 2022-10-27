import React, { useState } from "react";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { getZip } from "../../utils/file";

const SaveAsFile = (props) => {
  const [loading, setIsLoading] = useState(false);
  const {
    title,
    files,
    fileName,
    buttonType = "button",
    fileType = ".zip",
    ...rest
  } = props;

  const download = async () => {
    setIsLoading(true);
    try {
      const blob =
        fileType === ".zip"
          ? await getZip(files)
          : new Blob([JSON.stringify(files)], { type: "text/json" });

      saveAs(blob, `${fileName}${fileType}`);
    } catch (e) {
      message.error("Download failed");
    } finally {
      setIsLoading(false);
    }
  };
  return buttonType === "button" ? (
    <Button
      title={title}
      icon={<DownloadOutlined />}
      loading={loading}
      onClick={download}
      className={rest.className}
    />
  ) : (
    <Button className={rest.className} onClick={download} type="text">
      <DownloadOutlined /> {title}
    </Button>
  );
};

SaveAsFile.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      files: PropTypes.arrayOf(PropTypes.object),
      content: PropTypes.string,
    })
  ).isRequired,
  fileName: PropTypes.string.isRequired,
  title: PropTypes.string,
};

SaveAsFile.defaultProps = {
  title: "Download file",
};

export default SaveAsFile;
