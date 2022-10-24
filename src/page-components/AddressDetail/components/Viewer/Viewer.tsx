/*
it wants to access the document object, and it requires browser environment.
Basically you just need to avoid running that part out of browser environment
*/
import React, { useEffect, useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { useMonaco } from '@monaco-editor/react';
import { useEffectOnce } from 'react-use';
import CopyButton from 'components/CopyButton/CopyButton';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
require('./index.less');

interface IProps {
  content: string;
  isShow: boolean;
  name: string;
  path: string;
}
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

const positions = {};

const Viewer = (props: IProps) => {
  const monaco = useMonaco();
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [isReadOnly] = useState(true);
  const editorEl = useRef(null);
  const { content, name, path, isShow } = props;
  useEffectOnce(() => () => editor?.dispose());
  useEffect(() => {
    const language = getLanguage(name);
    const { [path]: position = { lineNumber: 1, column: 1, top: 1 } } = positions as any;
    if (editor) {
      editor.setValue(window.atob(content));
      editor.setPosition(position);
      editor.revealLine(position.lineNumber);
      editor.setScrollTop(position.top);
    } else {
      const monacoEditor = monaco?.editor.create(editorEl.current!, {
        lineNumbers: 'on',
        readOnly: isReadOnly,
        language,
        value: window.atob(content),
      });
      setEditor(monacoEditor);
      window.editor = monacoEditor;
    }
    return () => {
      if (editor) {
        positions[path] = {
          ...editor.getPosition(),
          top: editor.getScrollTop(),
        };
      }
    };
  }, [path, isShow, editorEl, monaco]);
  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        readOnly: isReadOnly,
      });
      editor.setValue(window.atob(content));
    }
  }, [isReadOnly, content]);

  const handleCopy = () => {
    try {
      copy(editor?.getValue() as string);
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
          <CopyButton onClick={handleCopy} />
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
