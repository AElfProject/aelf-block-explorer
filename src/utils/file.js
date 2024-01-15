/* eslint-disable import/prefer-default-export */
import JSZip from 'jszip';

function addFileOrFolder(zip, files) {
  files.forEach((file) => {
    const { name } = file;
    if (Array.isArray(file.files) && file.files.length > 0) {
      addFileOrFolder(zip.folder(name), file.files);
    } else {
      const content = window.atob(file.content);
      zip.file(name, content);
    }
  });
}

export const getZip = (files) => {
  const zip = new JSZip();
  addFileOrFolder(zip, files);
  return zip.generateAsync({
    type: 'blob',
  });
};