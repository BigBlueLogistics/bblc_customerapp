import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "atoms/MDBox";
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  RemoveRedEye as EyeIcon,
} from "@mui/icons-material";
import { TTableCellProps } from "types/reactTable";

function CellAction(props: TTableCellProps) {
  const {
    cell: {
      column: {
        cellProps: { onShowEdit, onShowCancelConfirmation },
      },
    },
    row,
  } = props;

  const { transid, status_id: statusId } = row.original;
  const canUpdate = Number(statusId) === 0;
  const formType = canUpdate ? "edit" : "view";

  return (
    <MDBox display="flex" width="fit-content" alignItems="center">
      <Tooltip title={canUpdate ? "Edit" : "View"} placement="top">
        <IconButton
          aria-label={canUpdate ? "edit" : "view"}
          color={canUpdate ? "success" : "info"}
          onClick={() => onShowEdit(transid, formType)}
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
