import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDCheckbox from "atoms/MDCheckbox";
import MDInput from "atoms/MDInput";
import MDAlert2 from "atoms/MDAlert2";
import SkeletonForm from "organisms/Skeleton/Form";
import { useFormik } from "formik";
import { format, parseISO } from "date-fns";
import { IFormEdit } from "./type";
import validationSchema from "./validationSchema";

function FormEdit({
  open,
  onClose,
  onUpdate,
  data,
  isLoadingEdit,
  isLoadingUpdate,
  status,
  message,
}: IFormEdit) {
  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      id: data.id || "",
      customer_code: data.customer_code || "",
      company_name: data.company || "",
      fname: data.fname || "",
      lname: data.lname || "",
      email: data.email || "",
      email_verified_at: data.email_verified_at || "",
      is_verify: false,
      is_active: data.active === "true",
    },
    onSubmit: (validatedVal) => {
      const isActive = validatedVal.is_active.toString();
      const isVerify = validatedVal.is_verify.toString();
      const argsData = { ...validatedVal, is_active: isActive, is_verify: isVerify };
      onUpdate(validatedVal.id, argsData);
    },
  });

  const renderMessage = () => {
    if (status === "succeeded" || status === "failed") {
      const severity = status === "succeeded" ? "success" : "error";
      return (
        <MDAlert2
          severity={severity}
          dismissible
          sx={({ typography: { pxToRem } }) => ({
            width: "90%",
            margin: `${pxToRem(15)} auto`,
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {isLoadingEdit ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <DialogTitle>Update Member Details</DialogTitle>
          {renderMessage()}
          <DialogContent sx={{ paddingTop: "20px !important" }}>
            <input type="hidden" value={values.id} />

            {values.email_verified_at ? (
              <MDTypography
                mb={1}
                variant="body2"
                sx={({ typography: { pxToRem } }) => ({
                  font: "inherit",
                  fontSize: pxToRem(14),
                })}
              >
                <MDTypography
                  component="span"
                  sx={({ palette: { text } }) => ({
                    font: "inherit",
                    color: text.main,
                  })}
                >
                  Verified at:
                </MDTypography>{" "}
                <MDTypography
                  component="span"
                  sx={({ palette: { text } }) => ({
                    font: "inherit",
                    color: text.secondary,
                  })}
                >
                  {format(parseISO(values.email_verified_at), "MMM. dd, RR hh:mm aaa")}
                </MDTypography>{" "}
                <Icon color="info">verified</Icon>
              </MDTypography>
            ) : (
              <MDCheckbox
                label="Verify?"
                name="is_verify"
                onChange={handleChange}
                checked={String(values.is_verify) === "true"}
              />
            )}

            <MDBox mb={1}>
              <MDInput
                autoCapitalize="characters"
                margin="dense"
                name="customer_code"
                label="Customer code"
                type="text"
                fullWidth
                variant="standard"
                value={values.customer_code}
                error={touched.customer_code && Boolean(errors.customer_code)}
                helperText={touched.customer_code ? (errors.customer_code as string) : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                autoCapitalize="characters"
                margin="dense"
                name="company_name"
                label="Company"
                type="text"
                fullWidth
                variant="standard"
                value={values.company_name}
                error={touched.company_name && Boolean(errors.company_name)}
                helperText={touched.company_name ? (errors.company_name as string) : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1} display="flex" justifyContent="space-between">
              <MDInput
                margin="dense"
                id="fname"
                label="First name"
                type="text"
                variant="standard"
                value={values.fname}
                error={touched.fname && Boolean(errors.fname)}
                helperText={touched.fname ? (errors.fname as string) : ""}
                onChange={handleChange}
              />
              <MDInput
                margin="dense"
                id="lname"
                label="Last name"
                type="text"
                variant="standard"
                value={values.lname}
                error={touched.lname && Boolean(errors.lname)}
                helperText={touched.lname ? (errors.lname as string) : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? (errors.email as string) : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1} display="flex" alignItems="center">
              <MDTypography variant="body2">Inactive</MDTypography>
              <Switch
                name="is_active"
                color="primary"
                checked={String(values.is_active) === "true"}
                onChange={handleChange}
              />
              <MDTypography variant="body2">Active</MDTypography>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={onClose}>Close</MDButton>
            <MDButton type="submit" disabled={isLoadingUpdate} loading={isLoadingUpdate}>
              Update
            </MDButton>
          </DialogActions>
        </MDBox>
      )}
    </Dialog>
  );
}

export default FormEdit;
