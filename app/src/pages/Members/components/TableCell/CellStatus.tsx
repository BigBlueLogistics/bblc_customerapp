import MDBadge from "atoms/MDBadge";
import { TTableCellProps } from "types/reactTable";

function CellStatus({ value }: TTableCellProps) {
  const status = value === "true" ? "Active" : "Inactive";
  const color = status === "Active" ? "info" : "error";
  return (
    <MDBadge
      sx={({ typography: { pxToRem } }) => ({
        width: pxToRem(64),
      })}
      badgeContent={status}
      size="xs"
      container
      variant="gradient"
      color={color}
    />
  );
}

export default CellStatus;
