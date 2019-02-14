/**
 * @file formateTurnoverList
 * @author huangzongzhe
*/

export default function formateTurnoverList(input, interval, limit, order, time) {
    let timeList = [];
    for (let i = 0; i < limit; i++) {
        timeList.push(time - interval * i);
    }
    let output = timeList.map(timeListItem => {
        // 合并对应时间段的 买卖数据
        // 判断这个时间段买入还是卖出的量更大
        const list = input.find(inputItem => {
            return inputItem['ANY_VALUE(time)'] > timeListItem && inputItem['ANY_VALUE(time)'] < (timeListItem + interval) || inputItem['ANY_VALUE(time)'] == timeListItem && inputItem['ANY_VALUE(time)'] == (timeListItem + interval);
        });
        if (list) {
            return {
                count: list.count,
                time: timeListItem
            };
        }
        return {
            count: 0,
            time: timeListItem
        };
    });
    if (order.toLocaleLowerCase() === 'asc') {
        return output.reverse();
    }
    return output;
}
