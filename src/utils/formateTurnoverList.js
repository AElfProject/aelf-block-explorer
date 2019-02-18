/**
 * @file formateTurnoverList
 * @author huangzongzhe
*/

export default function formateTurnoverList(input, intervalTime, limit, order) {
    let output = input.slice(-(limit - 1));
    console.log(output);
    output[0].count = 0;
    output.push(
        {
            date: output[limit - 2].date + intervalTime,
            count: 0
        }
    );
    if (order.toLocaleLowerCase() === 'asc') {
        return output.reverse();
    }
    return output;
}
