import { Navigate } from "react-router-dom";
import selector from "./selector";

function DefaultPage() {
  const { isAuthenticated } = selector();
  if (isAuthenticated && !localStorage.getItem("apiToken")) {
    return <Navigate to="/sign-in" />;
  }

  return <Navigate to="/inventory" />;
}

export default DefaultPage;
