import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useFormik } from "formik";
import { useAppDispatch } from "hooks";
import { signIn, resetData } from "redux/auth/action";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDAlert2 from "atoms/MDAlert2";
import BasicLayout from "pages/Authentication/components/BasicLayout";

import bgImage from "assets/images/bg-bblc-wh5.jpg";
import validationSchema from "./validationSchema";
import selector from "./selector";

function SignIn() {
  const { errorMsg, hasError, isAuthenticated, apiToken, isLogging } = selector();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    validationSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (validatedVal) => {
      dispatch(signIn(validatedVal));
    },
  });

  const renderMessage = () => {
    if (hasError) {
      return (
        <MDAlert2
          severity="error"
          dismissible
          sx={({ typography: { pxToRem } }) => ({
            width: "90%",
            margin: `${pxToRem(15)} auto`,
          })}
        >
          <MDTypography variant="body2" fontSize={14}>
            {errorMsg}
          </MDTypography>
        </MDAlert2>
      );
    }
    return null;
  };

  useEffect(() => {
    if (isAuthenticated && apiToken) {
      navigate("/inventory", { replace: true });

      // Cache api token
      localStorage.setItem("apiToken", apiToken);
    }

    return () => {
      if (hasError) {
        dispatch(resetData());
      }
    };
  }, [isAuthenticated, apiToken, navigate, hasError, dispatch]);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-4}
          p={1}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 1 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        {renderMessage()}

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                name="email"
                type="email"
                label="Email"
                fullWidth
                onChange={handleChange}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? errors.email : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                name="password"
                type="password"
                label="Password"
                fullWidth
                onChange={handleChange}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password ? errors.password : ""}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={isLogging}
                loading={isLogging}
              >
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography
                component={Link}
                to="/reset-password-link"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Forgot your password?
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
