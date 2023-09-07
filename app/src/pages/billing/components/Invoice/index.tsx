import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { TInvoice } from "./types";

function Invoice({ date, id, price, noGutter }: TInvoice) {
  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {date}
        </MDTypography>
        <MDTypography variant="caption" fontWeight="regular" color="text">
          {id}
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography variant="button" fontWeight="regular" color="text">
          {price}
        </MDTypography>
        <MDBox display="flex" alignItems="center" lineHeight={1} ml={3} sx={{ cursor: "pointer" }}>
          <Icon fontSize="small">picture_as_pdf</Icon>
          <MDTypography variant="button" fontWeight="bold">
            &nbsp;PDF
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

Invoice.defaultProps = {
  noGutter: false,
};

export default Invoice;
