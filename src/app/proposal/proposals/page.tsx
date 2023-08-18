'use client';
import './index.css';
import { useEffect, useState } from 'react';
import microApp from '@micro-zoe/micro-app';
import { useRouter } from 'next/navigation';
const Proposal = () => {
  microApp.setData('proposals', { path: '/proposal/proposals' });

  return <micro-app name="proposals" url="http://localhost:3001"></micro-app>;
};
export default Proposal;
