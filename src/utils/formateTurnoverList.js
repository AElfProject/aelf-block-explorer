/**
 * @file formateTurnoverList
 * @author huangzongzhe
*/

export default function formateTurnoverList(input, intervalTime, limit, order) {
    if (input.lenght === 0) {
        let output = [];
        output.push(
            {
                date: output[output.length - 1].date + intervalTime,
                count: 0
            }
        );

        if (order.toLocaleLowerCase() === 'asc') {
            return output.reverse();
        }
        return output;
    }

    let output = input.slice(-(limit - 1));
    output[0].count = 0;
    output.push(
        {
            date: output[output.length - 1].date + intervalTime,
            count: 0
        }
    );

    if (order.toLocaleLowerCase() === 'asc') {
        return output.reverse();
    }
    return output;
}
