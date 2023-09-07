import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";

import { useFormik } from "formik";
import { TChangePassword } from "./types";
import validationSchema from "./validationSchema";

function ChangePassword({ title, onChangePass, shadow, isLoading }: TChangePassword) {
  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    validationSchema,
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: (validatedVal) => {
      onChangePass(validatedVal);
    },
  });
  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2} component="form" role="form" onSubmit={handleSubmit}>
        <MDBox mb={2}>
          <MDInput
            name="current_password"
            type="password"
            label="Current password"
            fullWidth
            onChange={handleChange}
            value={values.current_password}
            error={touched.current_password && Boolean(errors.current_password)}
            helperText={touched.current_password ? errors.current_password : ""}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            name="new_password"
            type="password"
            label="New password"
            fullWidth
            onChange={handleChange}
            value={values.new_password}
            error={touched.new_password && Boolean(errors.new_password)}
            helperText={touched.new_password ? errors.new_password : ""}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            name="confirm_password"
            type="password"
            label="Confirm new password"
            fullWidth
            onChange={handleChange}
            value={values.confirm_password}
            error={touched.confirm_password && Boolean(errors.confirm_password)}
            helperText={touched.confirm_password ? errors.confirm_password : ""}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            disabled={isLoading}
            loading={isLoading}
          >
            Change
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ChangePassword.defaultProps = {
  shadow: true,
};

export default ChangePassword;
