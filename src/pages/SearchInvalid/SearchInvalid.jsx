import React from "react";
import { Link } from "react-router-dom";
import IconFont from "../../components/IconFont";
import Search from "../Home/components/Search";
import useMobile from "../../hooks/useMobile";
const banner = require("../../assets/images/search_invalid.png");

import "./SearchInvalid.styles.less";
import { withRouter } from "../../routes/utils";
function SearchInvalid(props) {
  const { params } = props;
  const isMobile = useMobile();
  return (
    <div
      className={
        "basic-container-new search-invalid " + (isMobile ? "mobile" : "")
      }
    >
      <img src={banner} />
      <h3>Search not found !</h3>
      <p className="tip">
        Oops! The search string you entered was:{isMobile ? <br /> : " "}
        <span>{params.string}</span>
      </p>
      <p className="warning">Sorry! This is an invalid search string.</p>
      <Search />
      <Link to="/" className="back-btn">
        <IconFont type="right2" />
        Back Home
      </Link>
    </div>
  );
}

export default withRouter(SearchInvalid);
