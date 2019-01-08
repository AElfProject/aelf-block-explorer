/**
 * @file formatUtcToDate
 * @author zhouminghui
 * -V-
*/


export default function formatUtcToDate(utcDatetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    let tPos = utcDatetime.indexOf('T');
    let yearMonthDay = utcDatetime.substr(0, tPos);
    let newDatetime = yearMonthDay;

    return newDatetime;
}