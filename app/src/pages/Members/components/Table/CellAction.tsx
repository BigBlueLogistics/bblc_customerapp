import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "atoms/MDBox";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ITableCellProps } from "types/reactTable";

function CellAction(props: ITableCellProps) {
  const {
    cell: {
      column: {
        cellProps: { onShowEdit: showEdit, onShowDelete: showDelete },
      },
    },
    row,
  } = props;

  const userId = row.original.id;
  return (
    <MDBox display="flex" width="fit-content" alignItems="center">
      <Tooltip title="Edit" placement="top">
        <IconButton aria-label="edit" onClick={() => showEdit(userId)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      |
      <Tooltip title="Delete" placement="top">
        <IconButton aria-label="delete" onClick={showDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </MDBox>
  );
}

export default CellAction;
