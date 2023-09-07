import MDBadge from "atoms/MDBadge";
import { TTableCellProps } from "types/reactTable";

function CellStatus(props: TTableCellProps) {
  const { row } = props;

  const { status, status_id: statusId } = row.original;
  const statusColor = Number(statusId) === 0 ? "success" : "info";

  return (
    <MDBadge
      color={statusColor}
      size="xs"
      variant="gradient"
      sx={({ typography: { pxToRem } }) => ({ "& .MuiBadge-badge": { fontSize: pxToRem(11) } })}
      badgeContent={status}
    />
  );
}

export default CellStatus;
