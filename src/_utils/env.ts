import { unstable_noStore as noStore } from 'next/cache';

export default function getEnv(name: string) {
  noStore();
  return process.env[name];
}
