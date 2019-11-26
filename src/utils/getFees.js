/**
 * @file getFees
 * @author zhouminghui yangpeiyang
 * @role used to get a part of resource transaction fee
 */
import { FEE_RATE } from '@src/constants';

export default function getFees(pidElf) {
  const resourceFees = pidElf * FEE_RATE;
  return resourceFees;
}
