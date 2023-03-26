/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-13 03:09:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-16 16:43:07
 * @Description: file content
 */
// todo: make the reg allow the format like 0.
export const regPos = /^\d+(\.\d*)?$/; // 非负浮点数, allow 0.

// export const regBuyTooManyResource = /must be 0/;
export const regBuyTooManyResource = /InvalidValueException/;

export const validateVersion = (version) => {
  const regex = new RegExp(/^\d+(.\d+){3}$/);
  return regex.test(version);
};
