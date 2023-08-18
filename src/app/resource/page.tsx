'use client';
import './index.css';
import { useEffect, useState } from 'react';
import microApp from '@micro-zoe/micro-app';
import { useRouter } from 'next/navigation';
const Resource = () => {
  microApp.setData('resource', { path: '/resource' });

  return <micro-app name="resource" url="http://localhost:3001"></micro-app>;
};
export default Resource;
