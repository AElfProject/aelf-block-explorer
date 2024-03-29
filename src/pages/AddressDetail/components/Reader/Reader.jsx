import React, { useEffect, useState } from "react";
import { If, Then, Switch, Case } from "react-if";
import { Skeleton, Alert } from "antd";
import { sendHeight } from "../../../../common/utils";
import FileTree from "../FileTree";
import Viewer from "../Viewer/Viewer";
import "./index.less";
import useMobile from "../../../../hooks/useMobile";

function getDefaultFile(files = [], names = [], index = 0, path = "") {
  const filtered = files.filter((v) => v.name === names[index]);
  if (filtered.length === 0) {
    return {};
  }
  const newPath = `${path}${filtered[0].name}/`;
  if (index === names.length - 1) {
    if (Array.isArray(filtered[0].files) && filtered[0].files.length > 0) {
      return {
        ...filtered[0].files[0],
        path: `${newPath}${filtered[0].files[0].name}`,
      };
    }
    return {
      ...filtered[0],
      path: `${path}${filtered[0].name}`,
    };
  }
  if (Array.isArray(filtered[0].files)) {
    return getDefaultFile(filtered[0].files, names, index + 1, newPath);
  }
  return {
    ...filtered[0],
    path: newPath,
  };
}

function handleFiles(data) {
  let defaultFile;
  let result;
  try {
    result = JSON.parse(data.files || "[]");
  } catch (e) {
    result = data.files;
  } finally {
    defaultFile = getDefaultFile(result, [result[0].name]);
  }
  return {
    result,
    defaultFile,
  };
}

const sketchParagraph = {
  rows: 10,
  width: "100%",
};

const fetchingStatusMap = {
  FETCHING: "fetching",
  ERROR: "error",
  SUCCESS: "success",
};

const Reader = ({ contractInfo, isShow }) => {
  const isMobile = useMobile();
  const [files, setFiles] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(
    fetchingStatusMap.FETCHING
  );
  const [viewerConfig, setViewerConfig] = useState({});
  useEffect(() => {
    if (contractInfo.files) {
      const { result, defaultFile } = handleFiles(contractInfo);
      setFiles(result);
      setViewerConfig(defaultFile);
      setFetchingStatus(fetchingStatusMap.SUCCESS);
    }
    sendHeight(500);
  }, [contractInfo]);

  const onFileChange = (names) => {
    const selectedFile = getDefaultFile(files, names);
    if (Object.keys(selectedFile).length > 0) {
      setViewerConfig({
        ...selectedFile,
      });
    }
  };

  return (
    <div className="reader">
      {/* <Switch> */}
      {/* <Case condition={fetchingStatus === fetchingStatusMap.SUCCESS}> */}
      <>
        <If condition={isMobile}>
          <Then>
            <Alert
              message="Have a better experience on PC browser"
              type="warning"
              className="gap-bottom"
            />
          </Then>
        </If>
        <div className="contract-reader">
          <Switch>
            <Case condition={fetchingStatus === fetchingStatusMap.SUCCESS}>
              <FileTree files={files} onChange={onFileChange} />
            </Case>
            <Case condition={fetchingStatus === fetchingStatusMap.FETCHING}>
              <Skeleton active paragraph={sketchParagraph} />
            </Case>
          </Switch>
          <Viewer
            content={viewerConfig.content || ""}
            name={viewerConfig.name || ""}
            path={viewerConfig.path || ""}
            isShow={isShow}
          />
        </div>
      </>
    </div>
  );
};

export default Reader;
