/**
  The boxShadow() function helps you to create a box shadow for an element
 */

import rgba from "assets/theme-dark/functions/rgba";
import pxToRem from "assets/theme-dark/functions/pxToRem";

function boxShadow(
  offset: number[] = [],
  radius: number[] = [],
  color: string,
  opacity: number,
  inset = ""
) {
  const [x, y] = offset;
  const [blur, spread] = radius;

  return `${inset} ${pxToRem(x)} ${pxToRem(y)} ${pxToRem(blur)} ${pxToRem(spread)} ${rgba(
    color,
    opacity
  )}`;
}

export default boxShadow;
