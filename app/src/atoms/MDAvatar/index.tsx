import { forwardRef } from "react";
import MDAvatarRoot from "atoms/MDAvatar/MDAvatarRoot";
import { TMDAvatar } from "./types";

const MDAvatar = forwardRef<HTMLDivElement, TMDAvatar>(
  ({ bgColor, size, shadow, children, ...rest }, ref) => (
    <MDAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest}>
      {children}
    </MDAvatarRoot>
  )
);

MDAvatar.displayName = "MDAvatar";

// Setting default values for the props of MDAvatar
MDAvatar.defaultProps = {
  bgColor: "transparent",
  size: "md",
  shadow: "none",
  children: null,
};

export default MDAvatar;
