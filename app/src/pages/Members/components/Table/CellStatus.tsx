import MDBadge from "atoms/MDBadge";
import { ITableCellProps } from "types/reactTable";

function CellStatus({ value }: ITableCellProps) {
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
