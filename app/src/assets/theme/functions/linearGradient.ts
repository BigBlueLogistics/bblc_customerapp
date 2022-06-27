/**
  The linearGradient() function helps you to create a linear gradient color background
 */

function linearGradient(color: string | number, colorState: string | number, angle = 195) {
  return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

export default linearGradient;
