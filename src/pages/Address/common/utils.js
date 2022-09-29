/**
 * @file utils
 * @author atom-yang
 */
import JSZip from 'jszip';

function addFileOrFolder(zip, files) {
  files.forEach((file) => {
    const {
      name,
    } = file;
    if (Array.isArray(file.files) && file.files.length > 0) {
      addFileOrFolder(zip.folder(name), file.files);
    } else {
      const content = atob(file.content);
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

export const detectMobileBrowser = () => !!(navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i));

export const useSearchParams = (search, key) => new URLSearchParams(search).get(key);
