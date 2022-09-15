import React, { useEffect, useState, useRef } from "react";
import copy from "copy-to-clipboard";
import PropTypes from "prop-types";
import { message } from "antd";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useEffectOnce } from "react-use";

import "./index.less";
import CopyButton from "../../../../components/CopyButton/CopyButton";

const languageDetector = [
  {
    language: "csharp",
    test: /\.cs$/,
  },
  {
    language: "xml",
    test: /\.(csproj|xml)/,
  },
  {
    language: "plaintext",
    test: /.*/,
  },
];

function getLanguage(name) {
  return languageDetector.filter((v) => v.test.test(name))[0].language;
}

const positions = {};

const Viewer = (props) => {
  const [editor, setEditor] = useState(null);
  const [isReadOnly] = useState(true);
  const editorEl = useRef(null);
  const { content, name, path, isShow } = props;
  useEffectOnce(() => () => editor && editor.dispose());
  useEffect(() => {
    const language = getLanguage(name);
    const { [path]: position = { lineNumber: 1, column: 1, top: 1 } } =
      positions;
    if (isShow) {
      if (editor) {
        editor.updateOptions({
          language,
        });
        editor.setValue(window.atob(content));
        editor.setPosition(position);
        editor.revealLine(position.lineNumber);
        editor.setScrollTop(position.top);
      } else {
        if (editor) {
          editor.dispose();
        }
        const monacoEditor = monaco.editor.create(editorEl.current, {
          lineNumbers: "on",
          readOnly: isReadOnly,
          language,
          value: window.atob(content),
        });
        setEditor(monacoEditor);
        window.editor = monacoEditor;
      }
    }
    return () => {
      if (editor) {
        positions[path] = {
          ...editor.getPosition(),
          top: editor.getScrollTop(),
        };
      }
    };
  }, [path, isShow, editorEl]);
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
      copy(editor.getValue());
      message.success("Copied!");
    } catch (e) {
      message.error("Copy failed, please copy by yourself.");
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
