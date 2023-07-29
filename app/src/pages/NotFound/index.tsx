import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { NavLink } from "react-router-dom";
import selector from "./selector";

function NotFound() {
  const { isAuthenticated } = selector();

  const linkTo = () => {
    return isAuthenticated ? "/inventory" : "/sign-in";
  };

  return (
    <MDBox>
      <MDTypography variant="h3">Page not found</MDTypography>
      <NavLink to={linkTo()} replace>
        Back to Main page
      </NavLink>
    </MDBox>
  );
}

export default NotFound;
