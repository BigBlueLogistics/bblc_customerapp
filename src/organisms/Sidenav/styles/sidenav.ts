import { Theme } from "@mui/material";

export default function sidenavLogoLabel(theme: Theme, ownerState: { miniSidenav: any }) {
  const { functions, transitions, typography, breakpoints } = theme;
  const { miniSidenav } = ownerState;

  const { pxToRem } = functions;
  const { fontWeightMedium } = typography;

  return {
    ml: 0.5,
    fontWeight: fontWeightMedium,
    wordSpacing: pxToRem(-1),
    transition: transitions.create("opacity", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav ? 0 : 1,
    },
  };
}
