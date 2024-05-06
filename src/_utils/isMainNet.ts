import getEnv from './env';

export function checkMainNet() {
  return getEnv('NEXT_PUBLIC_NETWORK_TYPE') === 'MAINNET';
}
