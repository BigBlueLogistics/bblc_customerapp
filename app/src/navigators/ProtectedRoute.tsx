import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";
import selector from "./selector";

interface IProtectedRoute {
  authenticated: boolean;
}

function ProtectedRoute({ authenticated }: IProtectedRoute) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = selector();

  if (!authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isAuthenticated && !Cookies.get("XSRF-TOKEN")) {
    dispatch(setIsAuthenticated(false));
  }

  return <Outlet />;
}

export default ProtectedRoute;
