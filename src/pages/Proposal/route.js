/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import { Redirect } from 'react-router-dom';
import CreateOrganization from './containers/CreateOrganization';
import CreateProposal from './containers/CreateProposal';
import MyProposal from './containers/MyProposal';
import OrganizationList from './containers/OrganizationList';
import ProposalDetail from './containers/ProposalDetail';
import ProposalList from './containers/ProposalList';

export default [{
  path: '/proposalsDetail/:proposalId',
  component: () => <ProposalDetail />,
}, {
  path: '/proposals',
  component: () => <ProposalList />,
}, {
  path: '/organizations',
  component: () => <OrganizationList />,
}, {
  path: '/apply/:orgAddress',
  component: (isLogged) => (isLogged ? <CreateProposal /> : <Redirect to="/proposals" />),
}, {
  path: '/apply',
  component: (isLogged) => (isLogged ? <CreateProposal /> : <Redirect to="/proposals" />),
}, {
  path: '/myProposals',
  component: (isLogged) => (isLogged ? <MyProposal /> : <Redirect to="/proposals" />),
}, {
  path: '/createOrganizations',
  component: (isLogged) => (isLogged ? (
    <CreateOrganization />
  ) : (
    <Redirect to="/organizations" />
  )),
}];
