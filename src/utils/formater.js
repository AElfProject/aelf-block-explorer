/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 00:49:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 01:01:54
 * @Description: file content
 */
// eslint-disable-next-line import/no-cycle
import { RESOURCE_OPERATE_LIMIT, ELF_PRECISION } from "@src/constants";

const thousandsComma = (value) => {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  return `${value}`.replace(reg, "$&,");
};

const numberFormatter = (number) => {
  const num = Number(number);
  if (Number.isNaN(num)) {
    return number;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
};

const addUrlPrefix = (url) => `https://${url}`;

const removeUrlPrefix = (url) => url.replace(/^https:\/\//, "");

function getProcessedValue(value, hasDecimal) {
  let decimalProcessedValue = value;
  const isSmallNumber = value < RESOURCE_OPERATE_LIMIT && value > 0;
  decimalProcessedValue = value.toFixed(isSmallNumber ? ELF_PRECISION : 2);
  // eslint-disable-next-line prefer-const
  let [wholeNum, decimal] = `${decimalProcessedValue}`.split(".");
  wholeNum = thousandsComma(wholeNum);
  const processedValue = hasDecimal ? `${wholeNum}.${decimal}` : wholeNum;
  return processedValue;
}

// todo: consider to write another method to display a precision of 8. (8 contain the integer precision)
// todo: then use the method mentioned above to display the resource and elf
// todo: optimize the function name
const thousandsCommaWithDecimal = (value, hasDecimal = true) => {
  if (typeof value !== "number") return value;
  return getProcessedValue(value, hasDecimal);
};

const centerEllipsis = (str) => {
  return str && `${str.slice(0, 10)}...${str.slice(str.length - 10)}`;
};

const hexStringToByteArray = (hexString) => {
  const result = [];
  while (hexString.length >= 2) {
    result.push(parseInt(hexString.substring(0, 2), 16));
    hexString = hexString.substring(2, hexString.length);
  }
  return result;
};

const byteArrayToHexString = (byteArray) => {
  function mapFn(byte) {
    // eslint-disable-next-line no-bitwise
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }
  return Array.from(byteArray, mapFn).join("");
};

const base64ToByteArray = (base64String) => {
  const binaryString = window.atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
};

export {
  hexStringToByteArray,
  thousandsComma,
  numberFormatter,
  addUrlPrefix,
  removeUrlPrefix,
  thousandsCommaWithDecimal,
  centerEllipsis,
  byteArrayToHexString,
  base64ToByteArray,
};
