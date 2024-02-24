import { ResponsiveStyleValue } from "@mui/system";
import { Property } from "csstype";

export type TFooter = {
  position?: ResponsiveStyleValue<Property.Position | readonly NonNullable<Property.Position>[]>;
  light: boolean;
};
