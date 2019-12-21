//  getSvg.js
var fs = require('fs');
var path = require('path');
const svgDir = path.resolve(__dirname, './svg-icon');

// 读取单个文件
function readfile(filename) {

  // 去掉.DS_store这种，还有其它类型的文件。
  let nameNeedLength = filename.lastIndexOf('.');
  // let fileNameLength = filename.length;
  // if (filename.slice(nameNeedLength, fileNameLength) !== '.svg') {
  //     return;
  // }

  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function(err, data) {

      console.log('filename: >>>>>>>>>>>>>>.', filename);
      data = data.replace(/<\?xml.*?\?>|<\!--.*?-->|<!DOCTYPE.*?>/g, '');

      // console.log('data: ', data);
      // data = data.replace(/<\?xml version="1.0" encoding="UTF-8"\?>/g, '');
      let viewBox = data.match(/viewBox="\d*\s\d*\s\d*\s\d*"/g)[0];
      let svgMatch = data.match(/[width|height]="\d*px"/g);
      // data = data.replace(/^(<svg)(.*)(xlink)">$/g, `<svg viewBox="${viewBox}" version="1.1">`);
      data = data.replace(/(width|height)="\d*px"/g, '');
      data = data.replace(/xmlns[^>]*/g, '');

      data = data.replace(/stroke-width/g, 'strokeWidth');
      data = data.replace(/fill-rule=/g, 'fillRule');

      console.log(data, viewBox, svgMatch);
      if (err) reject(err);
      resolve({
        [filename.slice(0, nameNeedLength)]: data,
      });
    });
  });
}

// 读取SVG文件夹下所有svg
function readSvgs() {
  return new Promise((resolve, reject) => {
    fs.readdir(svgDir, function(err, files) {

      if (err) reject(err);
      files = files.filter(filename => {
        // 去掉.DS_store这种，还有其它类型的文件。
        let nameNeedLength = filename.lastIndexOf('.');
        let fileNameLength = filename.length;
        if (filename.slice(nameNeedLength, fileNameLength) !== '.svg') {
          return false;
        }
        return true;
      });

      Promise.all(files.map(filename => readfile(filename)))
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  });
}

// 生成js文件
readSvgs().then(data => {
  // console.log('data: ', data);
  let svgFile = 'export default ' + JSON.stringify(Object.assign.apply(this, data));
  fs.writeFile(path.resolve(__dirname, './svgs.js'), svgFile, function(err) {
    if(err) throw new Error(err);
  })
}).catch(err => {
  throw new Error(err);
});
