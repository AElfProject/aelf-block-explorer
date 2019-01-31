/**
 * @file getFees
 * @author zhouminghui
*/

export default function getFees(pidElf) {
    let resourceFees = pidElf / 1.005;
    resourceFees = pidElf - resourceFees;
    Number.isInteger(resourceFees) ? resourceFees : resourceFees = Math.ceil(resourceFees);
    console.log(resourceFees);
    return resourceFees;
}
