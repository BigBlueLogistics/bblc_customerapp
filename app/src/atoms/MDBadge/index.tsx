import { forwardRef } from "react";
import MDBadgeRoot from "atoms/MDBadge/MDBadgeRoot";
import { IMDBadge } from "./types";

const MDBadge = forwardRef<HTMLSpanElement, IMDBadge>(
  ({ color, variant, size, circular, indicator, border, container, children, ...rest }, ref) => (
    <MDBadgeRoot
      {...rest}
      ownerState={{ color, variant, size, circular, indicator, border, container, children }}
      ref={ref}
      color="default"
    >
      {children}
    </MDBadgeRoot>
  )
);

MDBadge.displayName = "MDBadge";

MDBadge.defaultProps = {
  color: "info",
  variant: "gradient",
  size: "sm",
  circular: false,
  indicator: false,
  border: false,
  children: false,
  container: false,
};

export default MDBadge;
