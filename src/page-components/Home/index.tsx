import React from 'react';
import Link from 'next/link';
import styles from './styles.module.less';
export default function Home() {
  return (
    <div className={styles.body}>
      <Link href={`/example`}>
        <a>框架使用 - 示例代码</a>
      </Link>
    </div>
  );
}
