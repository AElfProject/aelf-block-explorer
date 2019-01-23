/**
 * @file getFees
 * @author zhouminghui
*/

export default function getFees(fees) {
    let resourceFees = fees * 0.005;
    Number.isInteger(resourceFees) ? resourceFees += 1 : resourceFees = Math.ceil(resourceFees);
    console.log(resourceFees);
    return resourceFees;
}
