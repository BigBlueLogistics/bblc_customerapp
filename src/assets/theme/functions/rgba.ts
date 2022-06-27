/**
  The rgba() function helps you to create a rgba color code, it uses the hexToRgb() function
  to convert the hex code into rgb for using it inside the rgba color format.
 */
import hexToRgb from "assets/theme/functions/hexToRgb";
import chroma from "chroma-js";

function rgba(color: string | number | chroma.Color, opacity: string | number) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
