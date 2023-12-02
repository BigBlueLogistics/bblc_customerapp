import { TableCell, TableCellProps } from "@mui/material";
import MDBox from "atoms/MDBox";
import { useMaterialUIController } from "context";

function TableHeadCell(props: TableCellProps) {
  const { children } = props;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <TableCell variant="head" {...props}>
      <MDBox
        color={darkMode ? "white" : "secondary"}
        opacity={0.7}
        sx={({ typography: { size, fontWeightBold } }) => ({
          fontSize: size.xs,
          fontWeight: fontWeightBold,
          textTransform: "uppercase",
        })}
      >
        {children}
      </MDBox>
    </TableCell>
  );
}

export default TableHeadCell;
