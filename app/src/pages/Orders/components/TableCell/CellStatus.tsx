import MDBadge from "atoms/MDBadge";
import { ITableCellProps } from "types/reactTable";

function CellStatus(props: ITableCellProps) {
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
