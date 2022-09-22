/**
 * @file viewer
 * @author atom-yang
 */
import React, { useEffect, useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useMonaco } from '@monaco-editor/react';
require('./index.less');

const languageDetector = [
  {
    language: 'csharp',
    test: /\.cs$/,
  },
  {
    language: 'xml',
    test: /\.(csproj|xml)/,
  },
  {
    language: 'plaintext',
    test: /.*/,
  },
];

function getLanguage(name) {
  return languageDetector.filter((v) => v.test.test(name))[0].language;
}

let positions = {};

const Viewer = (props) => {
  const monaco = useMonaco();
  const [editor, setEditor] = useState(null);
  const [isReadOnly] = useState(true);
  const editorEl = useRef(null);
  const { content, name, path } = props;
  useEffect(() => () => editor && editor.dispose(), []);
  useEffect(() => {
    const language = getLanguage(name);
    if (editor) {
      const position = positions[path] || {
        lineNumber: 1,
        column: 1,
        top: 1,
      };
      editor.updateOptions({
        language,
      });
      editor.setValue(atob(content));
      editor.setPosition(position);
      editor.revealLine(position.lineNumber);
      editor.setScrollTop(position.top);
    } else {
      const monacoEditor = monaco?.editor.create(editorEl.current, {
        lineNumbers: 'on',
        readOnly: isReadOnly,
        language,
        value: atob(content),
      });
      setEditor(monacoEditor);
      window.editor = monacoEditor;
    }
    return () => {
      if (editor) {
        positions = {
          ...positions,
          [path]: {
            ...editor.getPosition(),
            top: editor.getScrollTop(),
          },
        };
      }
    };
  }, [monaco, path || null]);
  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        readOnly: isReadOnly,
      });
      editor.setValue(atob(content));
    }
  }, [isReadOnly]);

  const handleCopy = () => {
    try {
      copy(editor.getValue());
      message.success('Copied!');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };

  return (
    <div className="contract-viewer-monaco">
      <div className="contract-viewer-monaco-title gap-bottom-small">
        <div className="contract-viewer-monaco-title-path">{path}</div>
        <div className="contract-viewer-monaco-title-opt">
          <Button onClick={handleCopy} type="circle" icon={<CopyOutlined />} title="Copy code" />
        </div>
      </div>
      <div className="contract-viewer-monaco-code" ref={editorEl} />
    </div>
  );
};

Viewer.propTypes = {
  content: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Viewer;
