/**
 * @file Viewer
 * @author atom-yang
 */
import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import {
  If,
  Then,
  Switch,
  Case,
} from 'react-if';
import { HistoryOutlined } from '@ant-design/icons';
import {
  Result,
  Skeleton,
  message,
  Steps,
  Divider,
  Alert,
} from 'antd';
import moment from 'moment';
import {
  sendHeight,
} from '@src/common/utils';
import FileTree from '../../../components/FileTree';
import Header from '../../../components/Header';
import SaveAsZip from '../../../components/Save';
import { request } from '../../../../../common/request';
import { API_PATH } from '../../../common/constants';
import { GlobalContext } from '../../../common/context';
import './index.less';
import config from '../../../../../common/config';
import {
  LinkIcon,
  CodeIcon,
} from '../../../common/Icon';
import AddressLink from '../../../components/AddressLink';

const Viewer = lazy(() => import(/* webpackChunkName: "viewer" */ '../../../components/Viewer'));

function getDefaultFile(files = [], names = [], index = 0, path = '') {
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
    result = JSON.parse(data.files || '[]');
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
  width: '100%',
};

const ViewerFallback = <Skeleton active paragraph={sketchParagraph} />;

const { Step } = Steps;

const StepDescription = (props) => {
  const {
    address,
    author,
    codeHash,
    txId,
    version,
    blockHeight,
  } = props;
  return (
    <>
      <div className="description-item">
        <span>Author: </span>
        <AddressLink address={author} />
      </div>
      <div className="description-item">
        <span>Code Hash: </span>
        <Link
          to={`/contract/${address}/${codeHash}`}
        >
          {codeHash}
        </Link>
      </div>
      <div className="description-item">
        <span>Version: </span>
        <Link
          to={`/contract/${address}/${codeHash}`}
        >
          {version}
        </Link>
      </div>
      <div className="description-item">
        <span>Transaction Id: </span>
        <a
          href={`${config.viewer.txUrl}/${txId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {txId}
          <LinkIcon
            className="gap-left-small"
          />
        </a>
      </div>
      <div className="description-item">
        <span>Block Height: </span>
        <a
          href={`${config.viewer.blockUrl}/${blockHeight}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blockHeight}
          <LinkIcon
            className="gap-left-small"
          />
        </a>
      </div>
    </>
  );
};

StepDescription.propTypes = {
  address: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  codeHash: PropTypes.string.isRequired,
  txId: PropTypes.string.isRequired,
  blockHeight: PropTypes.number.isRequired,
};

const EventMap = {
  CodeUpdated: 'Code Updated',
  AuthorChanged: 'Author Changed',
  ContractDeployed: 'Contract Deployed',
};

const fetchingStatusMap = {
  FETCHING: 'fetching',
  ERROR: 'error',
  SUCCESS: 'success',
};

const Reader = () => {
  const global = useContext(GlobalContext);
  const {
    isMobile = false,
  } = global;
  const {
    address,
    codeHash,
  } = useParams();
  const [files, setFiles] = useState([]);
  const [contractInfo, setContractInfo] = useState({});
  const [error, setError] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [history, setHistory] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState(fetchingStatusMap.FETCHING);
  const [viewerConfig, setViewerConfig] = useState({});
  useEffect(() => {
    let promise;
    if (codeHash && address) {
      setFetchingStatus(fetchingStatusMap.FETCHING);
      promise = request(API_PATH.GET_FILES, {
        codeHash,
        address,
      }, { method: 'GET' }).then((filesData) => {
        if (Object.keys(filesData || {}).length === 0) {
          throw new Error('There is no such contract');
        }
        return filesData;
      });
    } else if (address && !codeHash) {
      setFetchingStatus(fetchingStatusMap.FETCHING);
      promise = Promise.all([
        request(API_PATH.GET_HISTORY, {
          address,
        }, { method: 'GET' }),
        request(API_PATH.GET_FILES, {
          address,
        }, { method: 'GET' }),
      ]).then(([historyList, filesData]) => {
        if (historyList.length === 0) {
          throw new Error('There is no such contract');
        }
        setHistory(historyList);
        return filesData;
      });
    } else {
      setFetchingStatus(fetchingStatusMap.ERROR);
      message.error('There is no such contract');
      setError(new Error('There is no such contract'));
    }
    if (promise) {
      promise.then((data) => {
        const {
          files: resFiles,
        } = data;
        if (!resFiles) {
          throw new Error('Please wait for contract decompiling');
        }
        const {
          result,
          defaultFile,
        } = handleFiles(data);
        setFiles(result);
        setViewerConfig(defaultFile);
        setFetchingStatus(fetchingStatusMap.SUCCESS);
        const info = {
          ...data,
        };
        delete info.files;
        setContractInfo(info);
        sendHeight(500);
      }).catch((e) => {
        message.error(e.message || e.msg);
        setError(e);
        setFetchingStatus(fetchingStatusMap.ERROR);
        sendHeight(500);
      });
    }
  }, [address, codeHash]);

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
      <Switch>
        <Case condition={fetchingStatus === fetchingStatusMap.SUCCESS}>
          <>
            <Header
              author={contractInfo.author || ''}
              isSystemContract={contractInfo.isSystemContract || false}
              contractName={contractInfo.contractName || ''}
            />
            <If condition={isMobile}>
              <Then>
                <Alert
                  message="Have a better experience on PC browser"
                  type="warning"
                  className="gap-bottom"
                />
              </Then>
            </If>
            <h2>
              <CodeIcon
                className="gap-right"
              />
              Contract Info
              <SaveAsZip
                className="gap-left"
                files={files}
                fileName={address || codeHash || 'contract'}
              />
            </h2>
            <div className="contract-reader">
              <FileTree
                files={files}
                onChange={onFileChange}
              />
              <Suspense fallback={ViewerFallback}>
                <Viewer
                  content={viewerConfig.content || ''}
                  name={viewerConfig.name || ''}
                  path={viewerConfig.path || ''}
                />
              </Suspense>
            </div>
            <If condition={!codeHash}>
              <Then>
                <div
                  className="contract-history"
                >
                  <h2>
                    <HistoryOutlined className="gap-right" />
                    History
                  </h2>
                  <Divider />
                  <Steps
                    progressDot
                    current={0}
                    direction="vertical"
                  >
                    {history.map((v) => (
                      <Step
                        key={v.txId}
                        title={EventMap[v.event]}
                        subTitle={moment(v.updateTime).format('YYYY/MM/DD HH:mm:ss')}
                        description={<StepDescription {...v} />}
                      />
                    ))}
                  </Steps>
                </div>
              </Then>
            </If>
          </>
        </Case>
        <Case condition={fetchingStatus === fetchingStatusMap.FETCHING}>
          <Skeleton
            active
            paragraph={sketchParagraph}
          />
        </Case>
        <Case condition={fetchingStatus === fetchingStatusMap.ERROR}>
          <Result
            status="error"
            title={error.message || error.msg || 'Error Happened'}
            subTitle="Please make sure your URL parameter address is an valid contract address"
          />
        </Case>
      </Switch>
    </div>
  );
};

export default Reader;
