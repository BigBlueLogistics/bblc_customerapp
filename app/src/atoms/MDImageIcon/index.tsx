import { IMDImageIcon } from "./types";

function MDImageIcon({ src, alt = "", width = "24px", height = "24px" }: IMDImageIcon) {
  return <img src={src} alt={alt} width={width} height={height} />;
}

export default MDImageIcon;
