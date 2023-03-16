import MDBadge from "atoms/MDBadge";
import { ITableCellProps } from "types/reactTable";

function CellStatus(props: ITableCellProps) {
  const { row } = props;

  const { status } = row.original;
  const statusColor = status.id === 0 ? "success" : "info";

  return (
    <MDBadge
      color={statusColor}
      size="xs"
      variant="gradient"
      sx={({ typography: { pxToRem } }) => ({ "& .MuiBadge-badge": { fontSize: pxToRem(11) } })}
      badgeContent={status.name}
    />
  );
}

export default CellStatus;
