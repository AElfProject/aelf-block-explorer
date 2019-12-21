/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 00:49:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 01:01:54
 * @Description: file content
 */
import { RESOURCE_OPERATE_LIMIT, ELF_PRECISION } from '@src/constants';

const thousandsComma = value => {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (value + '').replace(reg, '$&,');
};

const addUrlPrefix = url => `https://${url}`;

const removeUrlPrefix = url => url.replace(/^https:\/\//, '');

// todo: consider to write another method to display a precision of 8. (8 contain the integer precision)
// todo: then use the method metioned above to display the resource and elf
// todo: optimize the function name
const thousandsCommaWithDecimal = (value, hasDecimal = true) => {
  if (typeof value !== 'number') return value;
  let decimalProcessedValue = value;
  if (value < RESOURCE_OPERATE_LIMIT && value > 0) {
    decimalProcessedValue = value.toFixed(ELF_PRECISION);
  } else {
    decimalProcessedValue = value.toFixed(2);
  }

  const arr = `${decimalProcessedValue}`.split('.');
  const wholeNum = thousandsComma(arr[0]);
  const decimal = arr[1];
  const processedValue = hasDecimal ? `${wholeNum}.${decimal}` : wholeNum;
  return processedValue;
};

const centerEllipsis = str => {
  return str && `${str.slice(0, 10)}...${str.slice(str.length - 10)}`;
};

export {
  thousandsComma,
  addUrlPrefix,
  removeUrlPrefix,
  thousandsCommaWithDecimal,
  centerEllipsis
};
