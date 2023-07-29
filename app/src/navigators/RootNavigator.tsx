import { Routes, Route } from "react-router-dom";
import RoutesType from "types/routes";
import ProtectedRoute from "./ProtectedRoute";
import routes from "../routes";
import selector from "./selector";

function RootNavigator({ accountRole }: { accountRole: string }) {
  const { isAuthenticated, apiToken } = selector();

  const renderRoutes = (allRoutes: RoutesType) => {
    return allRoutes.map((route) => {
      if (route.collapse) {
        renderRoutes(route.collapse);
      }

      if (route.access === "protected") {
        return (
          <Route
            key={route.key}
            element={
              <ProtectedRoute
                authenticated={isAuthenticated}
                apiToken={apiToken}
                accountRole={accountRole}
                allowedRoles={route.allowedRoles}
              />
            }
          >
            <Route path={route.route} element={route.component} />
          </Route>
        );
      }

      return <Route key={route.key} path={route.route} element={route.component} />;
    });
  };

  return <Routes> {renderRoutes(routes)}</Routes>;
}

export default RootNavigator;
