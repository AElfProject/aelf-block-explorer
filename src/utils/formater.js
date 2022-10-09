/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 00:49:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 01:01:54
 * @Description: file content
 */
import { RESOURCE_OPERATE_LIMIT, ELF_PRECISION } from "@src/constants";

const thousandsComma = (value) => {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (`${value}`).replace(reg, "$&,");
};

const numberFormatter = (number) => {
  const num = Number(number)
  if (Number.isNaN(num)) {
    return number
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 8 })
}

const addUrlPrefix = (url) => `https://${url}`;

const removeUrlPrefix = (url) => url.replace(/^https:\/\//, "");

function getProcessedValue(value, hasDecimal) {
  let decimalProcessedValue = value;
  const isSmallNumber = value < RESOURCE_OPERATE_LIMIT && value > 0;
  decimalProcessedValue = value.toFixed(isSmallNumber ? ELF_PRECISION : 2);

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

export {
  thousandsComma,
  numberFormatter,
  addUrlPrefix,
  removeUrlPrefix,
  thousandsCommaWithDecimal,
  centerEllipsis,
};
