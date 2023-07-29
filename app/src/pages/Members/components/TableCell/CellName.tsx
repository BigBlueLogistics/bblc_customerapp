import { ITableCellProps } from "types/reactTable";

function CellName({ row }: ITableCellProps) {
  return (
    <span style={{ textTransform: "capitalize" }}>
      {row.original.fname} {row.original.lname}
    </span>
  );
}

export default CellName;
