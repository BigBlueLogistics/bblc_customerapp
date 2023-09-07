import { opt as optTheme } from "assets/theme";
import { opt as optThemeDark } from "assets/theme-dark";
import { TTheme } from "./theme";

export type TMaterialElem = {
  theme?: TTheme;
  themeProps?: typeof optTheme & typeof optThemeDark;
  ownerState?: { [key: string]: any };
};
