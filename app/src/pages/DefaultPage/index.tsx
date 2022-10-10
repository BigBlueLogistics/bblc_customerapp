import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import selector from "./selector";

function DefaultPage() {
  const { isAuthenticated } = selector();
  if (isAuthenticated && !Cookies.get("XSRF-TOKEN")) {
    return <Navigate to="/sign-in" />;
  }

  return <Navigate to="/inventory" />;
}

export default DefaultPage;
