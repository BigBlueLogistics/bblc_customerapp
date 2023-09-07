import { TTableCellProps } from "types/reactTable";

function CellName({ row }: TTableCellProps) {
  return (
    <span style={{ textTransform: "capitalize" }}>
      {row.original.fname} {row.original.lname}
    </span>
  );
}

export default CellName;
