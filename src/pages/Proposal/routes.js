/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import { Redirect } from "react-router-dom";
import { lazy } from "react";
import { RouterComponent } from "./App";
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
        element: (
          <RouterComponent
            target={<CreateProposal />}
            default='/proposal/proposals'
          ></RouterComponent>
        ),
      },
      {
        path: "apply",
        element: (
          <RouterComponent
            target={<CreateProposal />}
            default='/proposal/proposals'
          ></RouterComponent>
        ),
      },
      {
        path: "myProposals",
        element: (
          <RouterComponent
            target={<MyProposal />}
            default='/proposal/proposals'
          ></RouterComponent>
        ),
      },
      {
        path: "createOrganizations",
        element: (
          <RouterComponent
            target={<MyProposal />}
            default='/proposal/organizations'
          ></RouterComponent>
        ),
      },
    ],
  },
];
