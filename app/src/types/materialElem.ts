import { opt as optTheme } from "assets/theme";
import { opt as optThemeDark } from "assets/theme-dark";
import { ITheme } from "./theme";

export type IMaterialElem = {
  theme?: ITheme;
  themeProps?: typeof optTheme & typeof optThemeDark;
  ownerState?: { [key: string]: any };
};
