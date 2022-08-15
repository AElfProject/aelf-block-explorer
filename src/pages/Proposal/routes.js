/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import { Redirect } from "react-router-dom";
import { lazy } from "react";
const App = lazy(() => import("./App"));
const CreateOrganization = lazy(() =>
  import("./containers/CreateOrganization")
);
const CreateProposal = lazy(() => import("./containers/CreateProposal"));
const MyProposal = lazy(() => import("./containers/MyProposal"));
const OrganizationList = lazy(() => import("./containers/OrganizationList"));
const ProposalDetail = lazy(() => import("./containers/ProposalDetail"));
const ProposalList = lazy(() => import("./containers/ProposalList"));

export const ProposalRouter = [
  {
    path: "/proposal",
    element: <App />,
    children: [
      {
        path: "proposalsDetail/:proposalId",
        element: <ProposalDetail />,
      },
      {
        path: "proposals",
        element: <ProposalList />,
      },
      {
        path: "organizations",
        element: <OrganizationList />,
      },
      {
        path: "apply/:orgAddress",
        element: (isLogged) =>
          isLogged ? <CreateProposal /> : <Redirect to='/proposals' />,
      },
      {
        path: "apply",
        element: (isLogged) =>
          isLogged ? <CreateProposal /> : <Redirect to='/proposals' />,
      },
      {
        path: "myProposals",
        element: (isLogged) =>
          isLogged ? <MyProposal /> : <Redirect to='/proposals' />,
      },
      {
        path: "createOrganizations",
        element: (isLogged) =>
          isLogged ? <CreateOrganization /> : <Redirect to='/organizations' />,
      },
    ],
  },
];
