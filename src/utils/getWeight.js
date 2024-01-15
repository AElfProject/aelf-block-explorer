import { Decimal } from 'decimal.js';

/**
 * @file get weight
 * @author atom-yang
 */

export default function getWeight(tokenConverterContract, type) {
  return tokenConverterContract.GetPairConnector.call({
    symbol: type,
  }).then((res) => {
    const {
      resourceConnector,
      depositConnector,
    } = res;
    return {
      resourceWeight: new Decimal(resourceConnector.weight || 0),
      tokenWeight: new Decimal(depositConnector.weight || 0),
      virtualBalance: new Decimal(depositConnector.virtualBalance || 0),
    };
  });
}
