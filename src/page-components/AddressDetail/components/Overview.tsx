import React from 'react';
import { numberFormatter } from 'utils/formater';

export default function Overview({ elfBalance, prices }) {
  return (
    <section className="overview">
      <p>Overview</p>
      <div>
        <p>
          <span className="label">Balance</span>
          <span className="value">{elfBalance ? `${numberFormatter(elfBalance)} ELF` : '-'}</span>
        </p>
        <p>
          <span className="label">Value in USD</span>
          <span className="value">
            {elfBalance && prices.ELF
              ? `$${numberFormatter(prices.ELF * elfBalance)}(@ $${numberFormatter(prices.ELF)}/ELF)`
              : '-'}
          </span>
        </p>
      </div>
    </section>
  );
}
