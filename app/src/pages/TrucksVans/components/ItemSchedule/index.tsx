import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { useMaterialUIController } from "context";
import { formatDate, getValue } from "utils";
import { IItemSchedule } from "./types";

function ItemSchedule({ data, noGutter }: IItemSchedule) {
  const { vehiclenum, vehicletype, arrivaldate, arrivaltime } = data;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const arrivalDateTime = `${arrivaldate} ${arrivaltime}`;

  return (
    <MDBox
      component="li"
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "grey-100"}
      borderRadius="lg"
      p={1.2}
      mb={noGutter ? 0 : 1}
    >
      <MDBox width={{ xs: "100%", sm: "70%" }} display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={0.2}
        >
          <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {vehiclenum}
          </MDTypography>
        </MDBox>
        <MDBox mb={0.5} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Type:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              {vehicletype}
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mb={0.5} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Arrival:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {getValue(
                formatDate(arrivalDateTime, {
                  defaultValue: "n/a",
                })?.toString()
              )}
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of ItemSchedule
ItemSchedule.defaultProps = {
  noGutter: false,
};

export default ItemSchedule;
