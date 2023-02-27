import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "atoms/MDBox";
import { Edit as EditIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { ITableCellProps } from "types/reactTable";

function CellAction(props: ITableCellProps) {
  const {
    cell: {
      column: {
        cellProps: { onShowEdit, onShowCancelConfirmation },
      },
    },
    row,
  } = props;

  const { transid, status } = row.original;

  return (
    <MDBox display="flex" width="fit-content" alignItems="center">
      <Tooltip title="Edit" placement="top">
        <IconButton aria-label="edit" color="success" onClick={() => onShowEdit(transid)}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      {String(status).toLowerCase() === "order create" ? (
        <Tooltip title="Cancel request" placement="top">
          <IconButton
            aria-label="cancel"
            color="warning"
            onClick={() => onShowCancelConfirmation(transid)}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </MDBox>
  );
}

export default CellAction;
