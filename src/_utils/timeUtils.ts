import moment from 'moment';

export function getFormattedDate(date) {
  if (date) {
    const seconds = moment().diff(date, 'seconds');
    const minutes = moment().diff(date, 'minutes');
    const hours = moment().diff(date, 'hours');
    const days = moment().diff(date, 'days');

    if (minutes < 1) return `${seconds < 0 ? 0 : seconds} secs ago`;
    if (minutes < 60) return `${minutes % 60} mins ago`;
    if (hours < 24) return `${hours} hrs ${minutes % 60} mins ago`;
    return `${days} days ${hours % 24} hrs ago`;
  }
  return '';
}
