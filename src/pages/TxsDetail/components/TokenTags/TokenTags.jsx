import { Button, Spin, Tag } from "antd";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useEffectOnce } from "react-use";
import "./TokenTags.style.less";
import IconFont from "../../../../components/IconFont";
import { get } from "../../../../utils";
import { VIEWER_GET_ALL_TOKENS } from "../../../../constants";

export default function TokenTag({ values, isDone, price }) {
  const [showMore, setShowMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [decimals, setDecimals] = useState({});
  const [loadingFlag, setLoadingFlag] = useState(undefined);
  const [forceDone, setForceDone] = useState(false);

  const elfFirst = useMemo(() => {
    const keys = Object.keys(values);
    const withoutELF = keys.filter((key) => key !== "ELF");

    if (keys.length === withoutELF.length) {
      return keys;
    }
    return ["ELF", ...withoutELF];
  }, [values]);

  const getDecimal = useCallback(async () => {
    const result = await get(VIEWER_GET_ALL_TOKENS, {
      pageSize: 5000,
      pageNum: 1,
    });
    const { data = { list: [] } } = result;
    const { list } = data;
    setDecimals(
      Object.fromEntries(list.map((item) => [item.symbol, item.decimals]))
    );
  }, []);

  useEffectOnce(() => {
    getDecimal();
  });

  useEffect(() => {
    const container = document.querySelector(".tags-container");
    const height = container.clientHeight;
    if (height > 96) {
      setHasMore(true);
    }
    if (!isDone && !loadingFlag) {
      const flag = setTimeout(() => {
        setForceDone(true);
      }, 5000);
      setLoadingFlag(flag);
    }
  }, [values]);

  return (
    <div className="token-tags">
      <div className={`tags-wrap  ${showMore && "more"}`}>
        <div className="tags-container">
          {isDone || forceDone ? (
            elfFirst.map((key) => {
              const decimal = decimals[key] || 0;
              const val = values[key] / 10 ** decimal;
              return (
                <div key={key}>
                  {Object.keys(decimals).length ? (
                    <Tag>
                      {`${val.toLocaleString(undefined, {
                        maximumFractionDigits: decimal,
                      })} ${key}`}
                      {key === "ELF" && (
                        <span>(${(price.USD * val).toFixed(2)})</span>
                      )}
                    </Tag>
                  ) : (
                    "-"
                  )}
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
