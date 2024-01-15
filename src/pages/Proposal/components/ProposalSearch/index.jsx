// eslint-disable-next-line no-use-before-define
import React, { useCallback, useState, useEffect } from "react";
import { Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getProposalSelectListWrap } from "@redux/actions/proposalSelectList";

const toBottomDistance = 30;

let isFetch = false;
let timeout = null;
let currentValue = "";

// TODO reducer
const ProposalSearch = ({ selectMehtod = "ReleaseApprovedContract" }) => {
  const dispatch = useDispatch();
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const [param, setParam] = useState(proposalSelect.params);
  useEffect(() => {
    if (proposalSelect.isAll) return;
    getProposalSelectListWrap(dispatch, param).then(() => {
      isFetch = false;
    });
  }, [param]);

  const proposalIdSearch = useCallback((newValue) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = newValue;
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      setParam((v) => ({
        ...v,
        search: currentValue,
        pageNum: 1,
      }));
    }, 300);
  }, []);

  const onPopupScroll = useCallback((e) => {
    const popup = e.currentTarget;
    const popupChild = popup.children[0];
    const wrapperHeight = popup.clientHeight;
    const innerHeight = popupChild?.clientHeight;
    const toBottom = innerHeight - wrapperHeight;
    if ((popup.scrollTop + toBottomDistance > toBottom) && !isFetch) {
      isFetch = true;
      setParam((v) => ({ ...v, pageNum: v.pageNum + 1 }));
    }
  }, []);

  return (
    <Form.Item
      label="Proposal ID:"
      name="proposalId"
      rules={[
        {
          required: true,
          message: "Please choose a Proposal ID！",
        },
      ]}
    >
      <Select
        dropdownClassName="proposal-dropdown-option"
        showSearch
        onSearch={proposalIdSearch}
        filterOption={false}
        onPopupScroll={onPopupScroll}
        // open
      >
        {proposalSelect?.list
          ?.filter(({ contractMethod }) => {
            if (selectMehtod === "ReleaseApprovedContract") {
              return contractMethod === "ProposeContractCodeCheck";
            }
            if (selectMehtod === "ReleaseCodeCheckedContract") {
              return (
                contractMethod === "DeploySmartContract" ||
                contractMethod === "UpdateSmartContract"
              );
            }
            return true;
          })
          .map((item) => (
            <Select.Option key={item.proposalId} value={item.proposalId}>
              {item.proposalId}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );
};

ProposalSearch.propTypes = {
  selectMehtod: PropTypes.string.isRequired,
};

export default ProposalSearch;
