import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDButton from "atoms/MDButton";
import { ICancelConfirmation } from "./types";

function CancelConfirmation({
  transId,
  openConfirmation,
  isLoading,
  OnCancelYes,
  OnCancelNo,
}: ICancelConfirmation) {
  return (
    <Dialog open={openConfirmation} fullWidth maxWidth="md" color="">
      <DialogTitle>Cancel Request Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to cancel this request with Transaction no:{" "}
        <strong>{transId}?</strong>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={OnCancelNo} disabled={isLoading}>
          No
        </MDButton>
        <MDButton onClick={() => OnCancelYes(transId)} loading={isLoading}>
          Yes
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default CancelConfirmation;
