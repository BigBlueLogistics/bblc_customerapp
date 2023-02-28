import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "atoms/MDBox";
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  RemoveRedEye as EyeIcon,
} from "@mui/icons-material";
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
  const canUpdate = String(status).toLowerCase() === "order create";

  return (
    <MDBox display="flex" width="fit-content" alignItems="center">
      <Tooltip title={canUpdate ? "Edit" : "View"} placement="top">
        <IconButton
          aria-label={canUpdate ? "edit" : "view"}
          color={canUpdate ? "success" : "info"}
          onClick={() => onShowEdit(transid)}
        >
          {canUpdate ? <EditIcon /> : <EyeIcon />}
        </IconButton>
      </Tooltip>

      {canUpdate ? (
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
