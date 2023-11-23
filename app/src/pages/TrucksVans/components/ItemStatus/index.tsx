import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDButton from "atoms/MDButton";
import MDIcon from "atoms/MDIcon";
import { differenceInDays } from "date-fns";
import { getValue, formatDate } from "utils";
import { TItemStatus } from "./types";

function ItemStatus({ data, darkMode, noGutter = false, onOpenStatusDetails }: TItemStatus) {
  const renderPluggedIcon = (pluggedstatus: string) => {
    if (pluggedstatus === "PLUGGED-IN") {
      return (
        <MDIcon
          color="success"
          sx={({ typography: { pxToRem } }) => ({
            transform: "rotate(45deg)",
            fontSize: `${pxToRem(50)} !important`,
          })}
          title={pluggedstatus}
        >
          power
        </MDIcon>
      );
    }

    if (pluggedstatus === "PLUGGED-OUT") {
      return (
        <MDIcon
          sx={({ typography: { pxToRem } }) => ({
            fontSize: `${pxToRem(50)} !important`,
          })}
          title={pluggedstatus}
        >
          power_off
        </MDIcon>
      );
    }

    return null;
  };

  const whLoc = (location: string) => {
    if (location) {
      return ["TRUCK", "YARD"].indexOf(location.toUpperCase()) > 0
        ? "CONTAINER / TRUCK YARD"
        : `WAREHOUSE ${location}`;
    }
    return "";
  };

  const status = ({
    whdate,
    currentstatus,
    arrivalstatus,
    whschedule,
  }: {
    whdate: string;
    currentstatus: string;
    arrivalstatus: string;
    whschedule: string;
  }) => {
    if (whdate) {
      if (currentstatus) {
        return currentstatus.toUpperCase();
      }
      return "PROCESSED";
    }
    if (whschedule) {
      return `SCHEDULED ${whschedule}`;
    }
    return arrivalstatus.toUpperCase();
  };
  const ageFromArrivalDate = (arrivaldate: string) => {
    const convertedArrivalDate = new Date(arrivaldate);
    return differenceInDays(new Date(), convertedArrivalDate) || 0;
  };

  return data && data.length ? (
    <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
      {data.map(
        ({
          vanno,
          vmrno,
          type,
          size,
          arrivaldate,
          pluggedstatus,
          location,
          currentstatus,
          arrivalstatus,
          whdate,
          whschedule,
        }) => (
          <MDBox
            key={vanno}
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
                  {vanno}&nbsp;
                  <MDTypography
                    component="span"
                    variant="caption"
                    fontWeight="regular"
                    textTransform="capitalize"
                  >
                    (VMR {vmrno})
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDBox mb={0.5} lineHeight={0}>
                <MDTypography variant="caption" color="text">
                  Location:&nbsp;&nbsp;&nbsp;
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                    {whLoc(location)}
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDBox mb={0.5} lineHeight={0}>
                <MDTypography variant="caption" color="text">
                  Type / Size:&nbsp;&nbsp;&nbsp;
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                    {type} / {size}
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDBox mb={0.5} lineHeight={0}>
                <MDTypography variant="caption" color="text">
                  Arrival:&nbsp;&nbsp;&nbsp;
                  <MDTypography variant="caption" fontWeight="medium">
                    {getValue(
                      formatDate(arrivaldate, {
                        format: "MM/dd/yyyy",
                        defaultValue: "n/a",
                      })?.toString()
                    )}
                  </MDTypography>
                  &nbsp;
                  <MDTypography variant="caption" fontWeight="regular">
                    ({ageFromArrivalDate(arrivaldate)} days(s))
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDBox mb={0.5} lineHeight={0}>
                <MDTypography variant="caption" color="text">
                  Status:&nbsp;&nbsp;&nbsp;
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                    {status({ whdate, currentstatus, arrivalstatus, whschedule })}
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              width={{ xs: "100%", sm: "30%" }}
              height="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin="auto 0"
            >
              <MDBox
                display="flex"
                alignItems="center"
                mt={{ xs: 2, sm: 0 }}
                ml={{ xs: -1.5, sm: 0 }}
              >
                {renderPluggedIcon(pluggedstatus)}
              </MDBox>

              <MDButton
                variant="text"
                iconOnly
                onClick={() => onOpenStatusDetails(vmrno, "view")}
                title="View details"
              >
                <MDIcon fontSize={25} color="action">
                  visibility
                </MDIcon>
              </MDButton>
            </MDBox>
          </MDBox>
        )
      )}
    </MDBox>
  ) : (
    <MDBox component="li" display="flex" justifyContent="center" alignItems="center">
      <MDTypography variant="body2" fontWeight="light" textAlign="center">
        No data available.
      </MDTypography>
    </MDBox>
  );
}

export default ItemStatus;
