/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Link from "@mui/material/Link";
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer() {
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      mt="auto"
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}
        <Link href="https://www.bigbluelogisticscorp.com/" target="_blank">
          <MDTypography variant="button" fontWeight="medium">
            &nbsp;BigBlue Logistics Corporation,&nbsp;
          </MDTypography>
        </Link>
        All Rights Reserved.
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        <MDBox component="small" px={2} lineHeight={1}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Version 2.0 Customer Portal
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Footer;
