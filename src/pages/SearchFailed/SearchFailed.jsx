import { Button } from "antd";
import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router";
import IconFont from "../../components/IconFont";
import useMobile from "../../hooks/useMobile";

import "./SearchFailed.styles.less";

const banner = require("../../assets/images/search_invalid.png");

function SearchFailed() {
  const isMobile = useMobile();
  const nav = useNavigate();
  return (
    <div
      className={clsx(
        "search-failed basic-container-new",
        isMobile && "mobile"
      )}
    >
      <img src={banner} alt="search failed" />
      <h3>Search failed !</h3>
      <p className="try-again">Please try again!</p>
      <Button type="link" className="back-btn" onClick={() => nav(-1)}>
        <IconFont type="Search" />
        Search Again
      </Button>
    </div>
  );
}
export default SearchFailed;
