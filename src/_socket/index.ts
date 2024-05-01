import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SignalR from './signalr';

export default function Socket() {
  // const [error, setError] = useState<any>(null);
  const [socket, setSocket] = useState<SignalR | null>(null);
  const pathName = usePathname();
  useEffect(() => {
    const signalR = new SignalR({ url: '/api/app/blockchain/explore' });
    console.log('signalR---', signalR);
    // if (error !== false) {
    signalR
      .initAndStart()
      .then(() => {
        setSocket(signalR);
        // setError(false);
      })
      .catch((e) => {
        setSocket(signalR);
        // setError(e);
      });
    // }
  }, [pathName]);

  return socket;
}
