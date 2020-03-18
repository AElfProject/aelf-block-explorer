/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-26 19:17:12
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-26 19:17:45
 * @Description: file content
 */

export const rand16Num = (len = 0) => {
  const result = [];
  for (let i = 0; i < len; i = i + 1) {
    result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
  }
  return result.join('');
};

export const removeAElfPrefix = name => {
  if (/^(AElf\.)(.*?)+/.test(name)) {
    return name.split('.')[name.split('.').length - 1];
  }
  return name;
};
