import { MouseEventHandler, useState } from "react";
import Fade from "@mui/material/Fade";
import MDBox from "atoms/MDBox";
import MDAlertRoot from "atoms/MDAlertGradient/MDAlertRoot";
import MDAlertCloseIcon from "atoms/MDAlertGradient/MDAlertCloseIcon";
import TMDAlert from "./types";

function MDAlertGradient({ color, dismissible, children, ...rest }: TMDAlert) {
  const [alertStatus, setAlertStatus] = useState("mount");

  const handleAlertStatus = () => setAlertStatus("fadeOut");

  // The base template for the alert
  const alertTemplate = (mount = true) => (
    <Fade in={mount} timeout={300}>
      <MDAlertRoot ownerState={{ color }} {...rest}>
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
      </MDAlertRoot>
    </Fade>
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
MDAlertGradient.defaultProps = {
  color: "info",
  dismissible: false,
};

export default MDAlertGradient;
