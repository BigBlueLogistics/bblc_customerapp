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
import MDSelect from "atoms/MDSelect";
import SkeletonForm from "organisms/Skeleton/Form";
import { useFormik } from "formik";
import { format, parseISO } from "date-fns";
import { IFormEdit } from "./types";
import validationSchema, { TValidationSchema } from "./validationSchema";

function FormEdit({ open, onClose, onUpdate, viewData, updateData }: IFormEdit) {
  const { data: viewResult, status: viewStatus } = viewData || {};
  const { status: updateStatus, message: updateMessage } = updateData || {};
  const isLoadingUpdate = updateStatus === "loading";

  const { values, handleChange, handleSubmit, touched, errors, resetForm } =
    useFormik<TValidationSchema>({
      enableReinitialize: true,
      validationSchema,
      initialValues: {
        id: viewResult?.id || "",
        customer_code: viewResult?.customer_code || "",
        company_name: viewResult?.company || "",
        fname: viewResult?.fname || "",
        lname: viewResult?.lname || "",
        phone_num: viewResult?.phone_num || "",
        email: viewResult?.email || "",
        email_verified_at: viewResult?.email_verified_at || "",
        is_verify: false,
        is_active: String(viewResult?.active) === "true",
        role_id: viewResult?.role_id || "",
        van_status: viewResult?.van_status || false,
        invnt_report: viewResult?.invnt_report || false,
      },
      onSubmit: (validatedVal) => {
        onUpdate(validatedVal.id, validatedVal);
      },
    });

  const renderMessage = () => {
    if (updateStatus === "succeeded" || updateStatus === "failed") {
      const severity = updateStatus === "succeeded" ? "success" : "error";
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
            {updateMessage}
          </MDTypography>
        </MDAlert2>
      );
    }
    return null;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      {viewStatus === "loading" ? (
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
            <MDBox mb={1.5}>
              <MDInput
                type="text"
                name="phone_num"
                label="Phone Number"
                variant="standard"
                fullWidth
                placeholder="Eg: 09xxxxxxxxx"
                value={values.phone_num}
                error={touched.phone_num && Boolean(errors.phone_num)}
                helperText={touched.phone_num ? errors.phone_num : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1} display="flex" flexDirection="column">
              <MDTypography component="label" variant="caption" fontWeight="regular" color="text">
                Van Status Recipient
              </MDTypography>
              <MDBox display="flex" flexDirection="row" alignItems="center">
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Inactive
                </MDTypography>
                <Switch
                  name="van_status"
                  color="primary"
                  checked={values.van_status}
                  onChange={handleChange}
                />
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Active
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mb={1} display="flex" flexDirection="column">
              <MDTypography component="label" variant="caption" fontWeight="regular" color="text">
                Inventory Report Recipient
              </MDTypography>
              <MDBox display="flex" flexDirection="row" alignItems="center">
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Inactive
                </MDTypography>
                <Switch
                  name="invnt_report"
                  color="primary"
                  checked={values.invnt_report}
                  onChange={handleChange}
                />
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Active
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mb={1} display="flex" flexDirection="column">
              <MDTypography component="label" variant="caption" fontWeight="regular" color="text">
                Account Status
              </MDTypography>
              <MDBox display="flex" flexDirection="row" alignItems="center">
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Inactive
                </MDTypography>
                <Switch
                  name="is_active"
                  color="primary"
                  checked={values.is_active}
                  onChange={handleChange}
                />
                <MDTypography variant="caption" fontWeight="regular" color="dark">
                  Active
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mb={1}>
              <MDSelect
                sx={{ margin: 0 }}
                name="role_id"
                label="Type"
                variant="outlined"
                onChange={handleChange}
                options={(viewResult?.roles as unknown as string[]) || []}
                value={values.role_id}
                showArrowIcon
                optKeyValue="id"
                optKeyLabel="name"
                itemStyle={{
                  textTransform: "uppercase",
                }}
              />
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleClose}>Close</MDButton>
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
