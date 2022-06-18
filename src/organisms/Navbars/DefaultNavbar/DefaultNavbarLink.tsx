import { Link } from "react-router-dom";
import Icon from "@mui/material/Icon";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { IDefaultNavbarLink } from "./types";

function DefaultNavbarLink({ icon, name, route, light }: IDefaultNavbarLink) {
  return (
    <MDBox
      component={Link}
      to={route}
      mx={1}
      p={1}
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer", userSelect: "none" }}
    >
      <Icon
        sx={{
          color: ({ palette: { white, secondary } }) => (light ? white.main : secondary.main),
          verticalAlign: "middle",
        }}
      >
        {icon}
      </Icon>
      <MDTypography
        variant="button"
        fontWeight="regular"
        color={light ? "white" : "dark"}
        textTransform="capitalize"
        sx={{ width: "100%", lineHeight: 0 }}
      >
        &nbsp;{name}
      </MDTypography>
    </MDBox>
  );
}

export default DefaultNavbarLink;
