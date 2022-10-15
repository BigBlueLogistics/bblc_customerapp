import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";
import selector from "./selector";

interface IProtectedRoute {
  authenticated: boolean;
  apiToken: "";
}

function ProtectedRoute({ authenticated, apiToken }: IProtectedRoute) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = selector();

  if (!authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isAuthenticated && !apiToken) {
    dispatch(setIsAuthenticated(false));
  }

  return <Outlet />;
}

export default ProtectedRoute;
