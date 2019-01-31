/**
 * @file getFees
 * @author zhouminghui
*/

export default function getFees(pidElf) {
    let resourceFees =  pidElf * 0.005;
    if (pidElf < 1000) {
        resourceFees = Math.floor(resourceFees);
    }
    else {
        resourceFees = Math.ceil(resourceFees);
    }
    return resourceFees;
}
