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
import SkeletonForm from "organisms/Skeleton/Form";
import { useFormik } from "formik";
import { format, parseISO } from "date-fns";
import { IFormEdit } from "./type";
import validationSchema from "./validationSchema";

function FormEdit({ open, onClose, data, isLoading }: IFormEdit) {
  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      customer_code: data.customer_code || "",
      fname: data.fname || "",
      lname: data.lname || "",
      email: data.email || "",
      email_verified_at: data.email_verified_at || "",
      is_verify: false,
      is_active: Boolean(data.active) || false,
    },
    onSubmit: (validatedVal) => {
      const isActive = validatedVal.is_active.toString();

      console.log("member update", { ...validatedVal, is_active: isActive });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {isLoading ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <DialogTitle>Update Member Details</DialogTitle>
          <DialogContent>
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
                checked={values.is_verify}
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
                helperText={touched.customer_code ? errors.customer_code : ""}
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
                helperText={touched.fname ? errors.fname : ""}
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
                helperText={touched.lname ? errors.lname : ""}
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
                helperText={touched.email ? errors.email : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1} display="flex" alignItems="center">
              <MDTypography variant="body2">Inactive</MDTypography>
              <Switch
                name="is_active"
                color="primary"
                checked={values.is_active}
                onChange={handleChange}
              />
              <MDTypography variant="body2">Active</MDTypography>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={onClose}>Cancel</MDButton>
            <MDButton type="submit">Update</MDButton>
          </DialogActions>
        </MDBox>
      )}
    </Dialog>
  );
}

export default FormEdit;
