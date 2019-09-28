/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 00:49:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-23 23:40:08
 * @Description: file content
 */
const thousandsComma = value => {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (value + '').replace(reg, '$&,');
};

const addUrlPrefix = url => `https://${url}`;

const removeUrlPrefix = url => url.replace(/^https:\/\//, '');

const thousandsCommaWithDecimal = value => {
  if (typeof value !== 'number') return value;
  const arr = `${value.toFixed(2)}`.split('.');
  const wholeNum = thousandsComma(arr[0]);
  const decimal = arr[1];
  const processedValue = `${wholeNum}.${decimal}`;
  return processedValue;
};

export {
  thousandsComma,
  addUrlPrefix,
  removeUrlPrefix,
  thousandsCommaWithDecimal
};
