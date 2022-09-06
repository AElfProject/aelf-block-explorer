import React from "react";
import IconFont from "../../components/IconFont";
import useMobile from "../../hooks/useMobile";
import { withRouter } from "../../routes/utils";
const banner = require("../../assets/images/search_invalid.png");

import "./SearchFailed.styles.less";
function SearchFailed(props) {
  const isMobile = useMobile();
  const { navigate } = props;
  return (
    <div
      className={
        "search-failed basic-container-new " + (isMobile ? "mobile" : "")
      }
    >
      <img src={banner} />
      <h3>Search failed !</h3>
      <p className='try-again'>Please try again!</p>
      <a className='back-btn' onClick={() => navigate(-1)}>
        <IconFont type='Search' />
        Search Again
      </a>
    </div>
  );
}
export default withRouter(SearchFailed);
