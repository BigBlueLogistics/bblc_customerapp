import MDTypography from "atoms/MDTypography";
import { styled } from "@mui/material/styles";
import { TMaterialElem } from "types/materialElem";

export const MessageTitle = styled(MDTypography)<TMaterialElem>(({ theme }) => {
  const { typography, breakpoints } = theme;
  const { pxToRem } = typography;

  return {
    fontSize: pxToRem(18),
    fontWeight: 500,

    [breakpoints.up("sm")]: {
      fontSize: pxToRem(25),
    },
    [breakpoints.up("md")]: {
      fontSize: pxToRem(30),
    },
  };
});

export const MessageDescription = styled(MDTypography)<TMaterialElem>(({ theme }) => {
  const { typography, breakpoints } = theme;
  const { pxToRem } = typography;

  return {
    fontSize: pxToRem(14),
    fontWeight: 400,

    [breakpoints.up("sm")]: {
      fontSize: pxToRem(18),
    },
    [breakpoints.up("md")]: {
      fontSize: pxToRem(20),
    },
  };
});
