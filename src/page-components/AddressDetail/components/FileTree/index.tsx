import React, { ChangeEvent, useMemo } from 'react';
import PropTypes from 'prop-types';
import Tree from 'rc-tree';
import { MinusSquareOutlined, PlusSquareOutlined, FileOutlined } from '@ant-design/icons';
import { IFile } from 'page-components/AddressDetail/types';
require('rc-tree/assets/index.css');

interface IProps {
  files: IFile[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function addKeyForTree(files: IFile[] = [], parentKey = '', splitChar = '#') {
  return files.map((file) => {
    const { name } = file;
    const newKey = `${parentKey}${name}`;
    if (Array.isArray(file.files) && file.files.length > 0) {
      return {
        ...file,
        files: addKeyForTree(file.files, `${newKey}${splitChar}`),
        key: newKey,
      };
    }
    return {
      ...file,
      key: newKey,
    };
  });
}

function getFirstFile(files: IFile[] = []) {
  if (files.length === 0) {
    return '';
  }
  if (!files[0].files) {
    return files[0].key;
  }
  return getFirstFile(files[0].files);
}

function renderTreeNode(item) {
  return {
    title: item.name,
    key: item.key,
    children: Array.isArray(item.files) && item.files.length > 0 && item.files.map(renderTreeNode),
  };
}

const renderSwitcherIcon = (props) => {
  const { expanded, isLeaf } = props;
  if (isLeaf) {
    return <FileOutlined className={`rc-switcher-line-icon`} />;
  }
  return expanded ? (
    <MinusSquareOutlined className="rc-switcher-line-icon" />
  ) : (
    <PlusSquareOutlined className="rc-switcher-line-icon" />
  );
};

const FileTree = (props: IProps) => {
  const { files = [], onChange } = props;
  const { filesWithKey, firstFileKey, firstDirectory } = useMemo(() => {
    const filesHandled = addKeyForTree(files);
    const firstKey = getFirstFile(filesHandled);
    return {
      filesWithKey: filesHandled,
      firstFileKey: [firstKey],
      firstDirectory: [filesHandled[0]?.key],
    };
  }, [files]);
  const onSelect = (selectedKey) => {
    if (selectedKey.length === 0) {
      return;
    }
    onChange(selectedKey[0].split('#'));
  };
  const treeData = useMemo(() => filesWithKey.map((v) => renderTreeNode(v)), [filesWithKey]);
  return (
    <Tree
      prefixCls="ant-tree"
      showLine
      autoExpandParent
      defaultSelectedKeys={firstFileKey}
      defaultExpandedKeys={firstDirectory}
      onSelect={onSelect}
      className="contract-viewer-file-tree"
      treeData={treeData}
      switcherIcon={renderSwitcherIcon}
    />
  );
};

FileTree.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      files: PropTypes.arrayOf(PropTypes.object),
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FileTree;
