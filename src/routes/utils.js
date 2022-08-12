import { useLocation, useMatch, useNavigate, useParams } from "react-router";

export function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Child
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
}
