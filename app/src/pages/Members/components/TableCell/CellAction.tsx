import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "atoms/MDBox";
import { Edit as EditIcon } from "@mui/icons-material";
import { TTableCellProps } from "types/reactTable";

function CellAction(props: TTableCellProps) {
  const {
    cell: {
      column: {
        cellProps: { onShowEdit: showEdit },
      },
    },
    row,
  } = props;

  const userId = row.original.id;
  return (
    <MDBox display="flex" width="fit-content" alignItems="center">
      <Tooltip title="Edit" placement="top">
        <IconButton aria-label="edit" onClick={() => showEdit(userId)} color="success">
          <EditIcon />
        </IconButton>
      </Tooltip>
    </MDBox>
  );
}

export default CellAction;
