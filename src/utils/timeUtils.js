/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-19 22:07:31
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-21 07:10:11
 * @Description: file content
 */
import moment from 'moment';

// todo: write test code
// todo: write util function's doc
export function isBeforeToday(time) {
  const flag = moment(time).isBefore(moment().startOf('day'));
  return flag;
}
