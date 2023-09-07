import MDBox from "atoms/MDBox";
import { TDataTableBodyCell } from "./types";

function DataTableBodyCell({
  noBorder,
  align,
  colSpan,
  rowSpan,
  children,
  isLoading,
}: TDataTableBodyCell) {
  const width = isLoading ? "100%" : "max-content";

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
      })}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <MDBox display="inline-block" width={width} color="text" sx={{ verticalAlign: "middle" }}>
        {children}
      </MDBox>
    </MDBox>
  );
}

DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

export default DataTableBodyCell;
