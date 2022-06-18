import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    white: { main: string };
    dark: { main: string };
    gradients: { dark: { main: string; state: string }; info: { main: string; state: string } };
    light: { main: string };
    transparent: { main: string };
  }
  interface PaletteOptions {
    white: { main: string };
    dark: { main: string };
    gradients: { dark: { main: string; state: string }; info: { main: string; state: string } };
    light: { main: string };
    transparent: { main: string };
  }
  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }

  // interface TypeBackground {
  //   card: string;
  //   sidenav: string;
  // }

  interface Theme {
    functions?: {
      linearGradient: (...args) => string;
      pxToRem: (value: number, radix?: number) => string;
      rgba: (color: string, rgba?: number) => string;
    };
    boxShadows?: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
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
  }

  interface ThemeOptions {
    functions?: {
      linearGradient: (...args) => string;
      pxToRem: (value: number, radix?: number) => string;
      rgba: (color: string, rgba?: number) => string;
    };
    boxShadows?: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
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
}
