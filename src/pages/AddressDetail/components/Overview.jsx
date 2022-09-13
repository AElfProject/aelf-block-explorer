import React from "react";

export default function Overview({ elfBalance, prices }) {
  return (
    <section className="overview">
      <p>Overview</p>
      <div>
        <p>
          <span className="label">Balance</span>
          <span className="value">
            {elfBalance ? `${Number(elfBalance).toLocaleString()} ELF` : "-"}
          </span>
        </p>
        <p>
          <span className="label">Value in USD</span>
          <span className="value">
            {elfBalance && prices.ELF
              ? `$${(prices.ELF * elfBalance).toLocaleString()}(@ $${
                  prices.ELF
                }/ELF)`
              : "-"}
          </span>
        </p>
      </div>
    </section>
  );
}
