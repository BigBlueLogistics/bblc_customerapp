import { TableCell, TableCellProps } from "@mui/material";

function TableBodyCell(props: TableCellProps) {
  const { children } = props;
  return (
    <TableCell
      variant="body"
      sx={({ typography: { pxToRem } }) => ({ padding: pxToRem(9) })}
      {...props}
    >
      {children}
    </TableCell>
  );
}

export default TableBodyCell;
