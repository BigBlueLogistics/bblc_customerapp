import { useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDAlert2 from "atoms/MDAlert2";
import CoverLayout from "pages/Authentication/components/CoverLayout";

import { useAppDispatch, useQueryString } from "hooks";
import { resetData, resetPass } from "redux/auth/action";

import { useFormik } from "formik";
import bgImage from "assets/images/bg-bblc-wh5.jpg";
import validationSchema, { TValidationSchema } from "./validationSchema";
import selector from "./selector";

function ResetPassword() {
  const dispatch = useAppDispatch();
  const queryString = useQueryString();
  const { status, message, isResettingPass } = selector();

  const { values, errors, handleChange, handleSubmit, touched, resetForm } =
    useFormik<TValidationSchema>({
      validationSchema,
      initialValues: {
        password: "",
        confirm_password: "",
      },
      onSubmit: (validatedVal) => {
        const token = queryString.get("token");
        const email = queryString.get("email");

        dispatch(resetPass({ token, email, ...validatedVal }));
      },
    });

  const renderMessage = () => {
    if (status === "succeeded" || status === "failed") {
      const severity = status === "succeeded" ? "success" : "error";
      return (
        <MDAlert2
          severity={severity}
          dismissible
          sx={() => ({
            width: "100%",
            margin: "0 auto",
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

  useEffect(() => {
    if (status === "succeeded") {
      resetForm();
    }

    return () => {
      if (status === "succeeded" || status === "failed") {
        dispatch(resetData());
      }
    };
  }, [resetForm, status, dispatch]);

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Change Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Input a new password for your account.
          </MDTypography>
        </MDBox>
        <MDBox
          sx={({ typography: { pxToRem } }) => ({
            width: "80%",
            margin: `${pxToRem(15)} auto`,
          })}
        >
          {renderMessage()}
        </MDBox>
        <MDBox pt={3} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                name="password"
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password ? errors.password : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                name="confirm_password"
                type="password"
                label="Confirm Password"
                variant="standard"
                fullWidth
                value={values.confirm_password}
                error={touched.confirm_password && Boolean(errors.confirm_password)}
                helperText={touched.confirm_password ? errors.confirm_password : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mt={6} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                disabled={isResettingPass}
                fullWidth
                loading={isResettingPass}
              >
                change
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ResetPassword;
