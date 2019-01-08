/**
 * @file formatUtc.js
 * @author zhouminghui
 * UTC时间转换为时间戳
*/

export default function formatUTC(utcDatetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    let tPos = utcDatetime.indexOf('T');
    let zPos = utcDatetime.indexOf('Z');
    let yearMonthDay = utcDatetime.substr(0, tPos);
    let hourMinuteSecond = utcDatetime.substr(tPos + 1, zPos - tPos - 1);
    let newDatetime = yearMonthDay + ' ' + hourMinuteSecond; // 2017-03-31 08:02:06

    // 处理成为时间戳
    let timeStamp = new Date(Date.parse(newDatetime));
    timeStamp = timeStamp.getTime();
    timeStamp = timeStamp / 1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    // let timeStamp = timeStamp + 8 * 60 * 60;
    // 时间戳转为时间
    // let beijingDatetime = new Date(parseInt(timeStamp, 10) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ');
    return timeStamp;
}