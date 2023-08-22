import React, { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

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
const CodeViewer = ({ data, name }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('csharp');
  function handleEditorDidMount(editor: any, _: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }
  useEffect(() => {
    const lang = getLanguage(name);
    setLanguage(lang);
  }, [data, name]);

  return (
    <div>
      <Editor height="350px" language={language} value={data} onMount={handleEditorDidMount} />
    </div>
  );
};

export default CodeViewer;
