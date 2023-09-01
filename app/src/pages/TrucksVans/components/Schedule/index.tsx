import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import ItemSchedule from "../ItemSchedule";
import { ISchedule } from "./types";

function Schedule({ data }: ISchedule) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Schedule Today
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {data && data.length ? (
            data.map((item) => <ItemSchedule key={item.id} data={item} />)
          ) : (
            <MDTypography variant="body2" fontWeight="light" textAlign="center">
              No data available.
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Schedule;
