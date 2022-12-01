import { IconProps } from "@mui/material";
import Icon from "@mui/material/Icon";

function ActionIcon({ onClick, children, title, ...rest }: IconProps) {
  return (
    <Icon
      {...rest}
      sx={({ palette: { icons } }) => ({
        cursor: "pointer",
        fontWeight: "bold",
        color: icons.search.darkBlue,
      })}
      fontSize="small"
      title={title}
      onClick={onClick}
    >
      {children}
    </Icon>
  );
}

export default ActionIcon;
