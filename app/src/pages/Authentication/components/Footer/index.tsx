import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import typography from "assets/theme/base/typography";
import { TFooter } from "./types";

function Footer({ light, position = "absolute" }: TFooter) {
  const { size } = typography;

  return (
    <MDBox position={position} width="100%" bottom={0} py={4}>
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
            fontSize={size.sm}
          >
            &copy; {new Date().getFullYear()},
            <Link href="https://www.bigbluelogisticscorp.com/" target="_blank">
              <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
                &nbsp;BigBlue Logistics Corporation,&nbsp;
              </MDTypography>
            </Link>
            All Rights Reserved.
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

Footer.defaultProps = {
  light: false,
};

export default Footer;
