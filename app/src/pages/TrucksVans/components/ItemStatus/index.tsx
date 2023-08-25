import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDButton from "atoms/MDButton";
import MDIcon from "atoms/MDIcon";
import { useMaterialUIController } from "context";
import { differenceInDays, format } from "date-fns";
import { IItemStatus } from "./types";

function ItemStatus({ data, noGutter, onOpenStatusDetails }: IItemStatus) {
  const {
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
  } = data;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const renderPluggedIcon = () => {
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

  const whLoc = () => {
    if (location) {
      return ["TRUCK", "YARD"].indexOf(location.toUpperCase()) > 0
        ? "CONTAINER YARD"
        : `WAREHOUSE ${location}`;
    }
    return "";
  };

  const status = () => {
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
  const convertedArrivalDate = new Date(arrivaldate);
  const ageFromArrivalDate = differenceInDays(new Date(), convertedArrivalDate) || 0;

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
              {whLoc()}
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
              {format(convertedArrivalDate, "MM-dd-yyyy")}
            </MDTypography>
            &nbsp;
            <MDTypography variant="caption" fontWeight="regular">
              ({ageFromArrivalDate} days(s))
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mb={0.5} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Status:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              {status()}
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
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          {renderPluggedIcon()}
        </MDBox>

        <MDButton variant="text" iconOnly onClick={onOpenStatusDetails} title="View details">
          <MDIcon fontSize={25} color="action">
            visibility
          </MDIcon>
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of ItemStatus
ItemStatus.defaultProps = {
  noGutter: false,
};

export default ItemStatus;
