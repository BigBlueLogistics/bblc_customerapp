import { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDAlert2 from "atoms/MDAlert2";
import CoverLayout from "pages/Authentication/components/CoverLayout";

import { useAppDispatch } from "hooks";
import { signUp, resetData } from "redux/auth/action";

// Images
import bgImage from "assets/images/bg-bblc-wh5.jpg";
import validationSchema, { TValidationSchema } from "./validationSchema";
import selector from "./selector";

function SignUp() {
  const dispatch = useAppDispatch();
  const { status, message, isSigningUp } = selector();

  const { values, errors, handleSubmit, handleChange, touched, resetForm } =
    useFormik<TValidationSchema>({
      validationSchema,
      initialValues: {
        fname: "",
        lname: "",
        phone_num: "",
        company: "",
        email: "",
        password: "",
      },
      onSubmit: (validatedVal) => {
        dispatch(signUp(validatedVal));
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

  useEffect(() => {
    if (status === "succeeded") {
      resetForm();
    }

    return () => {
      if (status === "succeeded" || status === "failed") {
        dispatch(resetData());
      }
    };
  }, [dispatch, resetForm, status]);

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your account details to register
          </MDTypography>
        </MDBox>

        {renderMessage()}

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={1}>
              <MDInput
                type="text"
                name="fname"
                label="First name"
                variant="standard"
                fullWidth
                value={values.fname}
                error={touched.fname && Boolean(errors.fname)}
                helperText={touched.fname ? errors.fname : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                type="text"
                name="lname"
                label="Last name"
                variant="standard"
                fullWidth
                value={values.lname}
                error={touched.lname && Boolean(errors.lname)}
                helperText={touched.lname ? errors.lname : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
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
            <MDBox mb={1}>
              <MDInput
                type="email"
                name="email"
                label="Email"
                variant="standard"
                fullWidth
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? errors.email : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                type="text"
                name="company"
                label="Company"
                variant="standard"
                fullWidth
                value={values.company}
                error={touched.company && Boolean(errors.company)}
                helperText={touched.company ? errors.company : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={1}>
              <MDInput
                type="password"
                name="password"
                label="Password"
                variant="standard"
                fullWidth
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password ? errors.password : ""}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={isSigningUp}
                loading={isSigningUp}
              >
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;
