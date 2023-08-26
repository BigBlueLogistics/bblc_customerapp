import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "atoms/MDButton";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import SkeletonForm from "organisms/Skeleton/Form";
import { getValue, formatDate } from "utils";
import { IStatusDetails } from "./types";

function StatusDetails({ open, onClose, data, loadingStatus }: IStatusDetails) {
  const {
    vanno,
    vmrno,
    type,
    size,
    arrivaldate,
    arrivaltime,
    arrivaldeliveryno,
    arrivalstatus,
    arrivalsealno,
    forwarder,
    outdate,
    outtime,
    outsealno,
    outdeliveryno,
    outstatus,
    plugin,
    whprocessend,
    whprocessstartdate,
    whprocessstarttime,
    whschedule,
  } = data || {};

  const arrivalDateTime = `${arrivaldate} ${arrivaltime}`;
  const departureDateTime = `${outdate} ${outtime}`;

  const renderPlugin = () => {
    if (plugin?.length) {
      return plugin.map(({ startdate, starttime, enddate, endtime, totalplughrs, id }) => (
        <MDBox mb={0.6} key={id}>
          <MDTypography variant="button" fontWeight="regular">
            {getValue(formatDate(`${startdate} ${starttime}`, { defaultValue: "n/a" })?.toString())}
          </MDTypography>
          {" - "}
          <MDTypography variant="button" fontWeight="regular">
            {getValue(formatDate(`${enddate} ${endtime}`, { defaultValue: "n/a" })?.toString())}
            &nbsp;(
            {getValue(totalplughrs, 0)} HR)
          </MDTypography>
        </MDBox>
      ));
    }

    return (
      <MDTypography component="div" variant="button" fontWeight="regular" textAlign="center">
        No data available.
      </MDTypography>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {loadingStatus === "loading" ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <>
          <DialogTitle>{vanno}</DialogTitle>
          <DialogContent>
            <MDBox aria-label="status content">
              <MDBox mb={1}>
                <MDTypography component="p" variant="button" fontWeight="regular">
                  VMR {vmrno}
                </MDTypography>
                <MDTypography component="p" variant="button" fontWeight="regular">
                  {type} / {size}
                </MDTypography>
                <MDTypography component="p" variant="button" fontWeight="regular">
                  {forwarder}
                </MDTypography>
              </MDBox>
              <MDBox aria-label="arrival info">
                <MDBox mb={0.6}>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="medium"
                    textTransform="uppercase"
                    sx={({ palette: { grey } }) => ({ backgroundColor: grey["200"], padding: 0.5 })}
                  >
                    Arrival info
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Date & Time:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(formatDate(arrivalDateTime, { defaultValue: "n/a" })?.toString())}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Seal:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(arrivalsealno, "n/a")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Delivery No.:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(arrivaldeliveryno, "n/a")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Status:
                  </MDTypography>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="regular"
                    textTransform={getValue(arrivalstatus) ? "uppercase" : "lowercase"}
                  >
                    {getValue(arrivalstatus, "n/a")}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox aria-label="warehouse info">
                <MDBox mb={0.6}>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="medium"
                    textTransform="uppercase"
                    sx={({ palette: { grey } }) => ({ backgroundColor: grey["200"], padding: 0.5 })}
                  >
                    Warehouse info
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Scheduled:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(
                      formatDate(whschedule, {
                        format: "MM/dd/yyyy",
                        defaultValue: "n/a",
                      })?.toString()
                    )}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Process Start:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(
                      formatDate(`${whprocessstartdate} ${whprocessstarttime}`, {
                        defaultValue: "n/a",
                      })?.toString()
                    )}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Process End:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(
                      formatDate(`${whprocessend}`, {
                        defaultValue: "n/a",
                      })?.toString()
                    )}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox aria-label="departure info">
                <MDBox mb={0.6}>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="medium"
                    textTransform="uppercase"
                    sx={({ palette: { grey } }) => ({ backgroundColor: grey["200"], padding: 0.5 })}
                  >
                    Departure info
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Date & Time:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(formatDate(departureDateTime, { defaultValue: "n/a" })?.toString())}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Seal:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(outsealno, "n/a")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Delivery No.:
                  </MDTypography>
                  <MDTypography component="div" variant="button" fontWeight="regular">
                    {getValue(outdeliveryno, "n/a")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={0.6} display="flex">
                  <MDTypography component="div" variant="button" fontWeight="light" width="30%">
                    Status:
                  </MDTypography>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="regular"
                    textTransform={getValue(outstatus) ? "uppercase" : "lowercase"}
                  >
                    {getValue(outstatus, "n/a")}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox aria-label="plug-in info">
                <MDBox mb={0.6}>
                  <MDTypography
                    component="div"
                    variant="button"
                    fontWeight="medium"
                    textTransform="uppercase"
                    sx={({ palette: { grey } }) => ({ backgroundColor: grey["200"], padding: 0.5 })}
                  >
                    Plug-in info
                  </MDTypography>
                  {renderPlugin()}
                </MDBox>
              </MDBox>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={onClose}>Close</MDButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default StatusDetails;
