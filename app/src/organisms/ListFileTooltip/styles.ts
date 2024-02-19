const toolTipStyle = () => ({
  maxWidth: "none !important",
  "& .MuiTypography-root": {
    position: "relative",

    "& .overlay-remove-file": {
      display: "none",
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
    },

    "&:hover > div:first-of-type": {
      display: "block",
    },
  },
});

export { toolTipStyle };
