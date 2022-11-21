import "@mui/material/styles";
import chroma from "chroma-js";

declare module "@mui/material/styles" {
  interface Palette {
    white: { main: string; focus: string };
    dark: { main: string; focus: string };
    gradients: {
      dark: { main: string; state: string };
      info: { main: string; state: string };
      primary: { main: string; state: string };
      secondary: { main: string; state: string };
      light: { main: string; state: string };
      success: { main: string; state: string };
      error: { main: string; state: string };
      warning: { main: string; state: string };
    };
    light: { main: string; focus: string };
    transparent: { main: string; focus: string };
    badgeColors: { [key: string]: any };
    icons: { [key: string]: any };
    inputBorderColor: string;
  }
  interface PaletteOptions {
    white: { main: string; focus: string };
    dark: { main: string; focus: string };
    gradients: {
      dark: { main: string; state: string };
      info: { main: string; state: string };
      primary: { main: string; state: string };
      secondary: { main: string; state: string };
      light: { main: string; state: string };
      success: { main: string; state: string };
      error: { main: string; state: string };
      warning: { main: string; state: string };
    };
    light: { main: string; focus: string };
    transparent: { main: string; focus: string };
    badgeColors: { [key: string]: any };
    icons: { [key: string]: any };
    inputBorderColor: string;
  }
  interface PaletteColor {
    darker?: string;
    focus?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }

  // interface TypeBackground {
  //   card: string;
  //   sidenav: string;
  // }

  interface Theme {
    functions: {
      linearGradient: (
        color: string | number,
        colorState: string | number,
        angle?: number
      ) => string;
      pxToRem: (value: number, radix?: number) => string;
      rgba: (color: string, rgba?: number) => string;
      boxShadow: (
        offset: number[],
        radius: number[],
        color: string,
        opacity: number,
        inset?: string
      ) => string;
      hexToRgb: (color: string | number | chroma.Color) => string;
    };
    boxShadows?: {
      none?: string;
      inset: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      navbarBoxShadow: string;
      colored: {
        primary: string;
        secondary: string;
        info: string;
        success: string;
        warning: string;
        error: string;
        light: string;
        dark: string;
      };
    };
    borders: {
      borderColor: string;
      borderWidth: {
        0: number;
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
      };
      borderRadius: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        section: string;
      };
    };
  }

  interface ThemeOptions {
    functions: {
      linearGradient: (
        color: string | number,
        colorState: string | number,
        angle?: number
      ) => string;
      pxToRem: (value: number, radix?: number) => string;
      rgba: (color: string, rgba?: number) => string;
      boxShadow: (
        offset: number[],
        radius: number[],
        color: string,
        opacity: number,
        inset?: string
      ) => string;
      hexToRgb: (color: string | number | chroma.Color) => string;
    };
    boxShadows?: {
      none?: string;
      inset: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      navbarBoxShadow: string;
    };
    borders: {
      borderColor: string;
      borderWidth: {
        0: number;
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
      };
      borderRadius: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        section: string;
      };
    };
    colored: {
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
      light: string;
      dark: string;
    };
  }
}

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    card: string;
    sidenav: string;
  }
  interface TypeText {
    main: string;
  }
}

declare module "@mui/material/styles/createTypography" {
  interface Typography {
    size: {
      xxs: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
    };
  }

  interface FontStyle {
    fontSizeRegular: string;
  }
}
