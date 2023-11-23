import { Outlet, Navigate } from "react-router-dom";
import DefaultPage from "pages/DefaultPage";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";
import selector from "./selector";

type TProtectedRoute = {
  authenticated: boolean;
  apiToken: string;
  accountRole: string;
  allowedRoles: string[];
};

function ProtectedRoute({ authenticated, apiToken, accountRole, allowedRoles }: TProtectedRoute) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = selector();

  if (!authenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isAuthenticated && !apiToken) {
    dispatch(setIsAuthenticated(false));
  }

  // Redirect to default page if account role has no permission to enter the route.
  if (isAuthenticated && apiToken && !allowedRoles.includes(accountRole)) {
    return <DefaultPage />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
