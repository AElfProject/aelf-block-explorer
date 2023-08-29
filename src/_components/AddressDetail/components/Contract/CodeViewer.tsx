import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import './code.css';
import clsx from 'clsx';

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
const CodeViewer = ({ data, name, auto }) => {
  const [language, setLanguage] = useState('csharp');
  useEffect(() => {
    const lang = getLanguage(name);
    setLanguage(lang);
  }, [data, name]);
  const onload = (ace) => {
    ace.moveCursorTo(0, 0);
  };
  return (
    <div className="code-viewer-container">
      <AceEditor
        mode={language}
        className={clsx('ace-editor !w-full rounded-lg', !auto && 'resize')}
        highlightActiveLine={true}
        showGutter={true}
        value={data}
        theme="textmate"
        name="UNIQUE_ID_OF_DIV"
        showPrintMargin={false}
        height={!auto ? '350px' : 'auto'}
        maxLines={auto ? 10000 : 0}
        setOptions={{
          readOnly: true,
          showLineNumbers: true,
          fixedWidthGutter: true,
          tabSize: 2,
          wrap: true,
        }}
        onLoad={onload}
      />
    </div>
  );
};

export default CodeViewer;
