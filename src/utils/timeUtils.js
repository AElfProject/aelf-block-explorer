/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-19 22:07:31
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-21 07:10:11
 * @Description: file content
 */
import moment from "moment";

// todo: write test code
// todo: write util function's doc
export function isBeforeToday(time) {
  const flag = moment(time).isBefore(moment().startOf("day"));
  return flag;
}

export function getFormattedDate(date, type) {
  if (date) {
    if (type === "Date Time") {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
    const seconds = moment().diff(date, "seconds");
    const minutes = moment().diff(date, "minutes");
    const hours = moment().diff(date, "hours");
    const days = moment().diff(date, "days");

    if (minutes < 1) return `${seconds < 0 ? 0 : seconds} secs ago`;
    if (minutes < 60) return `${minutes % 60} mins ago`;
    if (hours < 24) return `${hours} hrs ${minutes % 60} mins ago`;
    return `${days} days ${hours % 24} hrs ago`;
  }
  return "";
}

export function interval(func, delay) {
  let shouldContinue = true;
  let timerId;
  function run() {
    if (shouldContinue) {
      func();
      timerId = setTimeout(run, delay);
    }
  }
  timerId = setTimeout(run, delay);
  interval.clear = () => {
    clearTimeout(timerId);
  };
  return {
    clear() {
      shouldContinue = false;
    },
  };
}
