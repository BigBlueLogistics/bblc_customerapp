import { MouseEventHandler, useState, useEffect } from "react";
import Fade from "@mui/material/Fade";
import MDAlertRoot2 from "atoms/MDAlert2/MDAlertRoot";
import MDBox from "atoms/MDBox";
import MDAlertCloseIcon from "atoms/MDAlert2/MDAlertCloseIcon";
import IMDAlert from "./types";

function MDAlert2({ severity, dismissible, autoUnmount, sx, children }: IMDAlert) {
  const [alertStatus, setAlertStatus] = useState("mount");

  const handleAlertStatus = () => setAlertStatus("fadeOut");

  useEffect(() => {
    if (autoUnmount) {
      setTimeout(() => {
        setAlertStatus("unmount");
      }, 1000 * 15);
    }
  }, [autoUnmount]);

  // The base template for the alert
  const alertTemplate = (mount = true) => (
    <MDBox sx={sx}>
      <Fade in={mount} timeout={300}>
        <MDAlertRoot2 severity={severity}>
          <MDBox display="flex" alignItems="center" color="white">
            {children}
          </MDBox>
          {dismissible ? (
            <MDAlertCloseIcon
              onClick={(mount ? handleAlertStatus : null) as MouseEventHandler<HTMLSpanElement>}
            >
              &times;
            </MDAlertCloseIcon>
          ) : null}
        </MDAlertRoot2>
      </Fade>
    </MDBox>
  );

  switch (true) {
    case alertStatus === "mount":
      return alertTemplate();
    case alertStatus === "fadeOut":
      setTimeout(() => setAlertStatus("unmount"), 400);
      return alertTemplate(false);
    default:
      alertTemplate();
      break;
  }

  return null;
}

// Setting default values for the props of MDAlert
MDAlert2.defaultProps = {
  severity: "info",
  variant: "standard",
  autoUnmount: false,
  dismissible: false,
};

export default MDAlert2;
