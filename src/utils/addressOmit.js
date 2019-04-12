/**
 * @file addressOmit
 * @author zhouminghu
*/

export default function addressOmit(address) {
    return address.replace(address.slice(10, 36), '...');
}
