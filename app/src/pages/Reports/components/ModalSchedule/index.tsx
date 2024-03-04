import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDAlert2 from "atoms/MDAlert2";
import { useFormik } from "formik";
import miscData from "../../data";
import validationSchema, { TValidationSchedule } from "./validationSchema";
import { TModalSchedule } from "./types";

function ModalSchedule({ data, open, onClose, onUpdateSchedule }: TModalSchedule) {
  const { status, message } = data;
  const { sendingTimeOpts, inventoryTypesOpts, freqyOpts } = miscData();
  const timeOpts = sendingTimeOpts();
  const { values, handleChange, handleSubmit, resetForm, touched, errors } =
    useFormik<TValidationSchedule>({
      enableReinitialize: true,
      validationSchema,
      initialValues: {
        freqy: "",
        invty1: "",
        invty2: "",
        invty3: "",
        time1: "",
        time2: "",
        time3: "",
      },
      onSubmit: (validateVal) => {
        onUpdateSchedule(validateVal, resetForm);
      },
    });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderMessage = () => {
    if (status === "succeeded" || status === "failed") {
      const severity = status === "succeeded" ? "success" : "error";
      return (
        <MDAlert2
          severity={severity}
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: "325px" } }}
    >
      <MDBox component="form" role="form" onSubmit={handleSubmit}>
        <DialogTitle>Schedule Inventory Sending</DialogTitle>
        <DialogContent>
          {renderMessage()}
          <MDSelect
            sx={{ marginY: "10px" }}
            label="Sending Frequency"
            variant="outlined"
            name="freqy"
            onChange={handleChange}
            options={freqyOpts}
            value={values.freqy}
            showArrowIcon
            error={touched.freqy && Boolean(errors.freqy)}
            helperText={touched.freqy ? errors.freqy : ""}
            fullWidth
          />
          <MDSelect
            sx={{ marginBottom: "10px" }}
            label="Inventory Types 1"
            variant="outlined"
            name="invty1"
            onChange={handleChange}
            value={values.invty1}
            options={inventoryTypesOpts}
            showArrowIcon
            fullWidth
          />
          <MDSelect
            sx={{ marginBottom: "10px" }}
            label="Inventory Types 2"
            variant="outlined"
            name="invty2"
            onChange={handleChange}
            value={values.invty2}
            options={inventoryTypesOpts}
            showArrowIcon
            fullWidth
          />
          <MDSelect
            sx={{ marginBottom: "10px" }}
            label="Inventory Types 3"
            variant="outlined"
            name="invty3"
            onChange={handleChange}
            value={values.invty3}
            options={inventoryTypesOpts}
            showArrowIcon
            fullWidth
          />
          <MDSelect
            sx={{ marginBottom: "10px" }}
            label="1st Sending Time"
            variant="outlined"
            name="time1"
            onChange={handleChange}
            value={values.time1}
            options={timeOpts}
            showArrowIcon
            fullWidth
          />
          <MDSelect
            sx={{ marginBottom: "10px" }}
            label="2nd Sending Time"
            variant="outlined"
            name="time2"
            onChange={handleChange}
            value={values.time2}
            options={timeOpts}
            showArrowIcon
            fullWidth
          />
          <MDSelect
            label="3rd Sending Time"
            variant="outlined"
            name="time3"
            onChange={handleChange}
            value={values.time3}
            options={timeOpts}
            showArrowIcon
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            disabled={status === "loading"}
            loading={status === "loading"}
          >
            Record Info
          </MDButton>
          <MDButton onClick={handleClose}>Close</MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

export default ModalSchedule;
