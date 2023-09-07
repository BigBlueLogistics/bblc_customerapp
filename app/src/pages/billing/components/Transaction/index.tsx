import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDButton from "atoms/MDButton";
import { TTransaction } from "./types";

function Transaction({ color, icon, name, description, value }: TTransaction) {
  return (
    <MDBox key={name} component="li" py={1} pr={2} mb={1}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2}>
            <MDButton variant="outlined" color={color} iconOnly circular>
              <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
            </MDButton>
          </MDBox>
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {name}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDTypography variant="button" color={color} fontWeight="medium" textGradient>
          {value}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default Transaction;
