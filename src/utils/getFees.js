/**
 * @file getFees
 * @author zhouminghui
*/

export default function getFees(pidElf) {
    let resourceFees =  pidElf * 0.005;
    resourceFees = Math.ceil(resourceFees);
    return resourceFees;
}
