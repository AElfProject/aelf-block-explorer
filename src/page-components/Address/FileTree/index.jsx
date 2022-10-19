/**
 * @file file tree
 * @author atom-yang
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Tree from 'rc-tree';
import { MinusSquareOutlined, PlusSquareOutlined, FileOutlined } from '@ant-design/icons';
require('rc-tree/assets/index.css');

function addKeyForTree(files = [], parentKey = '', splitChar = '#') {
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

function getFirstFile(files = []) {
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

const FileTree = (props) => {
  const { files = [], onChange } = props;
  const { filesWithKey, firstFileKey, firstDirectory } = useMemo(() => {
    const filesHandled = addKeyForTree(files);
    const firstKey = getFirstFile(filesHandled);
    return {
      filesWithKey: filesHandled,
      firstFileKey: [firstKey],
      firstDirectory: [filesHandled[0].key],
    };
  }, [files]);
  const onSelect = (selectedKey) => {
    if (selectedKey.length === 0) {
      return;
    }
    onChange(selectedKey[0].split('#'));
  };
  const treeData = useMemo(() => filesWithKey.map((v) => renderTreeNode(v)), [filesWithKey]);
  const renderSwitcherIcon = (props) => {
    console.log(props);
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
  return (
    <Tree
      showLine
      showIcon={false}
      prefixCls="ant-tree"
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
      files: PropTypes.arrayOf(PropTypes.object),
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default FileTree;
