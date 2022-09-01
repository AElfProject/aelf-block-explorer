import React from "react";
import { Link } from "react-router-dom";
import IconFont from "../../components/IconFont";
import useMobile from "../../hooks/useMobile";
const banner = require("../../assets/images/search_invalid.png");

import "./SearchFailed.styles.less";
function SearchFailed(props) {
  const isMobile = useMobile();
  const { history } = props;
  return (
    <div
      className={
        "search-failed basic-container-new " + (isMobile ? "mobile" : "")
      }
    >
      <img src={banner} />
      <h3>Search failed !</h3>
      <p className="try-again">Please try again!</p>
      <a className="back-btn" onClick={() => history.goBack()}>
        <IconFont type="Search" />
        Search Again
      </a>
    </div>
  );
}
export default SearchFailed;
