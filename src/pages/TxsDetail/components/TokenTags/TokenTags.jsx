import { Button, Spin, Tag } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import "./TokenTags.style.less";
import IconFont from "../../../../components/IconFont";
export default function TokenTag({ values, isDone, price }) {
  const [showMore, setShowMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const elfFirst = useMemo(() => {
    const keys = Object.keys(values);
    const withoutELF = keys.filter((key) => key !== "ELF");

    if (keys.length === withoutELF.length) {
      return keys;
    }
    return ["ELF", ...withoutELF];
  }, [values]);

  useEffect(() => {
    const container = document.querySelector(".tags-container");
    const height = container.clientHeight;
    if (height > 96) {
      setHasMore(true);
    }
  }, [values]);

  return (
    <div className="token-tags">
      <div className={`tags-wrap  ${showMore && "more"}`}>
        <div className="tags-container">
          {isDone ? (
            elfFirst.map((key) => {
              const val = values[key] / (key === "ELF" ? 100000000 : 1);
              return (
                <div key={key}>
                  <Tag>
                    {`${val.toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })} ${key}`}
                    {key === "ELF" && (
                      <span>(${(price.USD * val).toFixed(2)})</span>
                    )}
                  </Tag>
                </div>
              );
            })
          ) : (
            <Spin />
          )}
        </div>
      </div>
      {hasMore && (
        <Button type="link" onClick={() => setShowMore(!showMore)}>
          {!showMore ? "More" : "Less"}
          <IconFont className={!showMore && "more"} type="shouqijiantou" />
        </Button>
      )}
    </div>
  );
}
