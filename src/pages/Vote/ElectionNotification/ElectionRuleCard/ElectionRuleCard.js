/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2020-01-08 11:25:16
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2020-01-08 15:44:44
 * @Description: file content
 */
import React, { memo } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import Iconfont from "@components/IconFont";
import { withRouter } from "../../../../routes/utils";
import "./ElectionRuleCard.style.less";
import Svg from "../../../../components/Svg/Svg";
import { onlyOkModal } from "../../../../components/SimpleModal/index.tsx";
import { isActivityBrowser } from "../../../../utils/isWebView";

function ElectionRuleCard(props) {
  const navigate = useNavigate();
  const { isCandidate, displayApplyModal, currentWallet, quitElection } = props;

  const onClick = () => {
    if (
      (currentWallet.discoverInfo || currentWallet.portkeyInfo) &&
      !currentWallet.nightElfInfo
    ) {
      onlyOkModal({
        message: `Becoming a candidate node with smart contract wallet address is not supported.`,
      });
      return;
    }

    if (isCandidate) {
      navigate(`/vote/apply/keyin?pubkey=${currentWallet?.publicKey}`);
    } else {
      displayApplyModal();
    }
  };

  const renderBtn = () => (
    <div className="btn-group">
      <Button
        type="primary"
        className="apply-to-be-a-node-btn"
        disabled={isActivityBrowser()}
        onClick={onClick}
      >
        {isCandidate ? "Modify team information" : "Become a candidate node"}
      </Button>
      {isCandidate && (
        <div className="quit-button" onClick={quitElection}>
          Quit <Svg icon="quit" className="quit-logo" />
        </div>
      )}
    </div>
  );
  const btnHtml = renderBtn();

  return (
    <section className="election-rule-card">
      <div className="election-rule-content">
        <h2 className="election-header-title">
          <Iconfont type="node-election" />
          Node Election
        </h2>
        <div className="election-container">
          <p className="election-intro">
            Every token holder has the opportunity to become a BP node. However,
            in order to make our networks and communities operate more smoothly
            and effectively, we have developed a set of standards and
            regulations to make eligible people candidate nodes. We increased
            their chances of being elected by voting. We will vote on the new BP
            consensus node every week and publish the election results.
            {/* <a className="view-plan-link" href="">
            View the node election plan >
          </a> */}
          </p>
          {btnHtml}
        </div>
      </div>
    </section>
  );
}
const mapStateToProps = (state) => {
  const { currentWallet } = state.common;
  return {
    currentWallet,
  };
};
export default connect(mapStateToProps)(withRouter(memo(ElectionRuleCard)));
