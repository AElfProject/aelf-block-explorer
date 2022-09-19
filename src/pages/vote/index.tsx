import { useEffect } from 'react';
import Router from 'next/router';
export default function Vote() {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname == '/vote') {
      Router.push('/vote/election');
    }
  });
}
