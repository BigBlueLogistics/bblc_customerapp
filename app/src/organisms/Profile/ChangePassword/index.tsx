import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { IProfilesList } from "./types";

function ProfilesList({ title, shadow }: IProfilesList) {
  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          ...
        </MDBox>
      </MDBox>
    </Card>
  );
}

ProfilesList.defaultProps = {
  shadow: true,
};

export default ProfilesList;
