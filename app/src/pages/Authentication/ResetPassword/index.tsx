import { useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDAlert2 from "atoms/MDAlert2";
import CircularProgress from "@mui/material/CircularProgress";
import CoverLayout from "pages/Authentication/components/CoverLayout";

import { useAppDispatch } from "hooks";
import { resetPass } from "redux/auth/action";

import { useFormik } from "formik";
import bgImage from "assets/images/bg-bblc-wh5.jpg";
import validationSchema from "./validationSchema";
import selector from "./selector";

function ResetPassword() {
  const dispatch = useAppDispatch();
  const { status, message, isResetting } = selector();

  const { values, errors, handleChange, handleSubmit, touched, resetForm } = useFormik({
    validationSchema,
    initialValues: {
      email: "",
    },
    onSubmit: (validatedVal) => {
      dispatch(resetPass(validatedVal));
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
  }, [resetForm, status]);

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
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
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
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <MDInput
                name="email"
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? errors.email : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mt={6} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                disabled={isResetting}
                fullWidth
              >
                {isResetting ? <CircularProgress size={22} color="inherit" /> : "reset"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ResetPassword;
