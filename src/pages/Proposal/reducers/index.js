/**
 * @file root reducer
 * @author atom-yang
 */
import { combineReducers } from 'redux';
import { common } from './common';
import { getOrganization } from './organizationList';
import { getProposalList } from './proposalList';
import { setModifyOrg } from './proposalModify';
import { getProposalSelectList } from './proposalSelectList';

const root = combineReducers({
  common,
  organizations: getOrganization,
  proposals: getProposalList,
  proposalSelect: getProposalSelectList,
  proposalModify: setModifyOrg,
});

export default root;
