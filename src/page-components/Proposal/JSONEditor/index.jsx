/**
 * @file json editor
 * @author atom-yang
 */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMonaco } from '@monaco-editor/react';

const JSONEditor = (props) => {
  const { value, type, onBlur, ...rest } = props;
  const [editor, setEditor] = useState(null);
  const editorEl = useRef(null);
  const monaco = useMonaco();
  useEffect(() => {
    const monacoEditor = monaco.editor.create(editorEl.current, {
      lineNumbers: 'on',
      language: type,
      value,
    });
    setEditor(monacoEditor);
    monacoEditor.onDidBlurEditorText(() => {
      onBlur(monacoEditor.getValue());
    });
    return () => {
      monacoEditor.dispose();
    };
  }, []);

  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        language: type,
      });
      editor.setValue(value);
    }
  }, [type, value]);

  return <div {...rest} ref={editorEl} />;
};

JSONEditor.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['json', 'plaintext']).isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default JSONEditor;
