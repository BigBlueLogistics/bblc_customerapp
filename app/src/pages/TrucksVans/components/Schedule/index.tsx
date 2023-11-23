import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { useMaterialUIController } from "context";
import SkeletonList from "organisms/Skeleton/List";
import ItemSchedule from "../ItemSchedule";
import { TSchedule } from "./types";

function Schedule({ data }: TSchedule) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { data: viewStatus, status } = data;

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={2} display="inline-flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium">
          Schedule Today
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        {status === "loading" ? (
          <SkeletonList darkMode={darkMode} noOfItems={5} width="100%" height="98px" />
        ) : (
          <ItemSchedule data={viewStatus} darkMode={darkMode} />
        )}
      </MDBox>
    </Card>
  );
}

export default Schedule;
