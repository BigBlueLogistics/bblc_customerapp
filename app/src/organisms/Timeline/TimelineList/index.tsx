import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { useMaterialUIController } from "context";
import { TimelineProvider } from "organisms/Timeline/context";
import { TTimelineList } from "./types";

function TimelineList({ title, dark, children }: TTimelineList) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <TimelineProvider value={dark}>
      <Card>
        <MDBox
          bgColor={dark ? "dark" : "white"}
          variant="gradient"
          borderRadius="xl"
          sx={{ background: ({ palette: { background } }) => darkMode && background.card }}
        >
          <MDBox pt={3} px={3}>
            <MDTypography variant="h6" fontWeight="medium" color={dark ? "white" : "dark"}>
              {title}
            </MDTypography>
          </MDBox>
          <MDBox p={2}>{children}</MDBox>
        </MDBox>
      </Card>
    </TimelineProvider>
  );
}

TimelineList.defaultProps = {
  dark: false,
};

export default TimelineList;
