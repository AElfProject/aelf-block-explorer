/**
 * @file strinbgToBuffer.js
 * @author huangzongzhe
*/

import proto from '@aelfqueen/protobufjs';
export default function hexToArrayBuffer(input) {
    let resultArray = [];
    console.log(input);
    if (typeof input !== 'string' || input.length % 2 !== 0) {
        throw Error('invalid input');
    }
    for (let i = 0, length = input.length; i < length; i += 2) {
        resultArray.push('0x' + input.slice(i, i + 2));
    }
    const array = Buffer.from(resultArray);
    return new proto.Reader(array).uint64();
}
