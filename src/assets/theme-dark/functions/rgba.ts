/**
  The rgba() function helps you to create a rgba color code, it uses the hexToRgb() function
  to convert the hex code into rgb for using it inside the rgba color format.
 */

// Material Dashboard 2 React helper functions
import hexToRgb from "assets/theme-dark/functions/hexToRgb";
import chroma from "chroma-js";

function rgba(color: string | number | chroma.Color, opacity: string | number) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
