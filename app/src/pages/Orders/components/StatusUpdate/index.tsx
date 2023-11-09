import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import MDInput from "atoms/MDInput";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDAlert2 from "atoms/MDAlert2";
import { useFormik } from "formik";
import StatusDetails from "./StatusDetails";
import validationSchema, { TValidationSchema } from "./validationSchema";
import { TStatusUpdate } from "./types";

function StatusUpdate({ data, open, onClose, onGetOutbound, onCreateOutbound }: TStatusUpdate) {
  const { status, message, data: viewStatus, action } = data;
  const { values, handleChange, handleSubmit, resetForm, touched, errors, isValid } =
    useFormik<TValidationSchema>({
      enableReinitialize: true,
      validationSchema,
      initialValues: {
        docNo: "",
      },
      onSubmit: ({ docNo }) => {
        onGetOutbound(docNo);
      },
    });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    if (viewStatus?.info) {
      onCreateOutbound(values.docNo);
    }
  };

  const renderMessage = () => {
    if ((status === "succeeded" || status === "failed") && action === "create") {
      return (
        <MDAlert2
          severity={status === "succeeded" ? "success" : "error"}
          dismissible
          sx={() => ({
            width: "100%",
            marginBottom: "10px",
          })}
        >
          <MDTypography variant="body2" fontSize={14}>
            {message}
          </MDTypography>
        </MDAlert2>
      );
    }
    return null;
  };

  const renderInputAdornment = () => {
    if (!errors.docNo) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="get Doc info"
            type="submit"
            size="small"
            disabled={status === "loading"}
            color="info"
          >
            {status === "loading" ? (
              <SearchedForIcon fontSize="small" titleAccess="loading" />
            ) : (
              <SearchIcon fontSize="small" titleAccess="search" />
            )}
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  const isDisabledNotify =
    !(status === "succeeded" && viewStatus.info) ||
    viewStatus.info.docNo !== values.docNo ||
    !isValid;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: "370px" } }}
    >
      <MDBox component="form" role="form" onSubmit={handleSubmit}>
        <DialogTitle>Outbound Status Notification</DialogTitle>
        <DialogContent>
          {renderMessage()}
          <MDInput
            margin="dense"
            name="docNo"
            label="Document Number"
            type="text"
            fullWidth
            variant="standard"
            error={touched.docNo && Boolean(errors.docNo)}
            helperText={touched.docNo ? errors.docNo : ""}
            value={values?.docNo}
            onChange={handleChange}
            InputProps={{
              endAdornment: renderInputAdornment(),
            }}
            sx={{ marginBottom: 2 }}
          />
          {status === "loading" ? (
            <MDBox display="flex" justifyContent="center">
              <CircularProgress size={30} color="inherit" />
            </MDBox>
          ) : (
            <StatusDetails data={data} />
          )}
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="gradient"
            color="info"
            disabled={isDisabledNotify}
            onClick={handleCreate}
            loading={status === "loading" && action === "create"}
          >
            Notify Me
          </MDButton>
          <MDButton onClick={handleClose}>Close</MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

export default StatusUpdate;
