/**
 * @file getResource
 * @author zhouminghui
 * get resource contract
*/

import {aelf} from '../utils';
import {resourceAddress} from '../../config/config';
export default function getResource(wallet) {
    const resource = aelf.chain.contractAt(resourceAddress, wallet);
    return resource;
}