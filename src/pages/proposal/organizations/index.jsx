/**
 * @file organization list
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Link from 'next/link';
import { Tabs, Pagination, Input, Spin, Row, Col, Modal, Empty, Result } from 'antd';
import { Switch, Case, If, Then } from 'react-if';
import Total from 'components/Total';
import constants, { LOADING_STATUS, LOG_STATUS } from 'page-components/Proposal/common/constants';
import Organization from './Organization';
import { setCurrentOrg } from 'redux/features/proposal/proposalDetail';
import { getOrganizations } from 'redux/features/proposal/organizationList';
require('./index.less');
import { removePrefixOrSuffix, sendHeight } from 'utils/utils';
import { useRouter } from 'next/router';
const { TabPane } = Tabs;
const { Search } = Input;
const { proposalTypes } = constants;

const OrganizationList = () => {
  const router = useRouter();
  const common = useSelector((state) => state.common, shallowEqual);
  const organizationList = useSelector((state) => state.organizations, shallowEqual);
  const { params, total, list, bpList, parliamentProposerList, loadingStatus } = organizationList;
  const { logStatus, isALLSettle, currentWallet } = common;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(params.search);

  const fetchList = (param) => {
    dispatch(getOrganizations(param));
  };

  useEffect(() => {
    if (isALLSettle === true) {
      fetchList(params);
    }
  }, [isALLSettle, logStatus]);

  useEffect(() => {
    setSearchValue(params.search);
  }, [params.search]);

  useEffect(() => {
    sendHeight(500);
  }, [list]);

  const onPageNumChange = (pageNum) =>
    fetchList({
      ...params,
      pageNum,
    });

  const onSearch = (value) => {
    fetchList({
      ...params,
      pageNum: 1,
      search: removePrefixOrSuffix(value.trim()),
    });
  };

  const handleTabChange = (key) => {
    fetchList({
      ...params,
      pageNum: 1,
      proposalType: key,
      search: '',
    });
  };

  const editOrganization = (orgAddress) => {
    const org = list.filter((item) => item.orgAddress === orgAddress)[0];
    Modal.confirm({
      className: 'organization-list-modal',
      title: 'Modify Organization?',
      content: 'Modifying the organization requires initiating a proposal to modify. Are you sure you want to modify?',
      onOk() {
        dispatch(setCurrentOrg(org));
        router.push(`/proposal/apply/${org.orgAddress}`);
      },
      icon: null,
    });
  };

  return (
    <div className="organization-list">
      <Tabs
        animated={false}
        tabBarExtraContent={
          logStatus === LOG_STATUS.LOGGED ? (
            <Link href="/proposal/createOrganizations">Create Organization&gt;</Link>
          ) : null
        }
        className="organization-list-tab"
        activeKey={params.proposalType}
        defaultActiveKey={params.proposalType}
        onChange={handleTabChange}>
        <TabPane tab={proposalTypes.PARLIAMENT} key={proposalTypes.PARLIAMENT} />
        <TabPane tab={proposalTypes.ASSOCIATION} key={proposalTypes.ASSOCIATION} />
        <TabPane tab={proposalTypes.REFERENDUM} key={proposalTypes.REFERENDUM} />
      </Tabs>
      <div className="organization-list-filter gap-top-large gap-bottom-large">
        <Row gutter={16}>
          <Col sm={6} xs={24}>
            <Search
              className="organization-list-search-input"
              placeholder="Organization Address"
              defaultValue={params.search}
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={onSearch}
            />
          </Col>
        </Row>
      </div>
      <div className="organization-list-list">
        <Switch>
          <Case condition={loadingStatus === LOADING_STATUS.LOADING || loadingStatus === LOADING_STATUS.SUCCESS}>
            <Spin spinning={loadingStatus === LOADING_STATUS.LOADING}>
              <Row gutter={16}>
                {list.map((item) => (
                  <Col sm={12} xs={24} key={item.orgAddress}>
                    <Organization
                      {...item}
                      bpList={bpList}
                      logStatus={logStatus}
                      editOrganization={editOrganization}
                      parliamentProposerList={parliamentProposerList}
                      currentWallet={currentWallet}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>
          </Case>
          <Case condition={loadingStatus === LOADING_STATUS.FAILED}>
            <Result status="error" title="Error Happened" subTitle="Please check your network" />
          </Case>
        </Switch>
        <If condition={loadingStatus === LOADING_STATUS.SUCCESS && list.length === 0}>
          <Then>
            <Empty />
          </Then>
        </If>
      </div>
      <Pagination
        className="float-right gap-top"
        showQuickJumper
        total={total}
        current={params.pageNum}
        pageSize={params.pageSize}
        hideOnSinglePage
        onChange={onPageNumChange}
        showTotal={Total}
      />
    </div>
  );
};

export default React.memo(OrganizationList);
