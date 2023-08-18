'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './index.css';
import microApp from '@micro-zoe/micro-app';

const Vote = () => {
  microApp.setData('vote', { path: '/vote/election' });
  return <micro-app name="vote" url="http://localhost:3001"></micro-app>;
};
export default Vote;
