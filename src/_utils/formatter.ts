/*
 * @Date: 2023-08-14 18:50:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 20:12:44
 * @Description: formatter utils
 */
import dayjs from 'dayjs';
const SYMBOL = process.env.NEXT_PUBLIC_SYMBOL;

export const formatDate = (date: string, type: string) => {
  if (date) {
    if (type === 'Date Time (UTC)') {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
    const seconds = dayjs().diff(date, 'seconds');
    const minutes = dayjs().diff(date, 'minutes');
    const hours = dayjs().diff(date, 'hours');
    const days = dayjs().diff(date, 'days');

    if (minutes < 1) return `${seconds < 0 ? 0 : seconds} secs ago`;
    if (minutes < 60) return `${minutes % 60} mins ago`;
    if (hours < 24) return `${hours} hrs ${minutes % 60} mins ago`;
    return `${days} days ${hours % 24} hrs ago`;
  }
  return '';
};

export const validateVersion = (version): boolean => {
  const regex = new RegExp(/^\d+(.\d+){3}$/);
  return regex.test(version);
};

export const numberFormatter = (number: string, symbol = SYMBOL): string => {
  const num = Number(number);
  if (Number.isNaN(num)) {
    return number;
  }
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${symbol}`;
};
