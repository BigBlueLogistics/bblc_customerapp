import { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import Alert from "@mui/material/Alert";
import CoverLayout from "pages/authentication/components/CoverLayout";

import { useAppDispatch, useAppSelector } from "hooks";
import { signUp } from "redux/auth/thunk";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import validationSchema from "./validationSchema";

function Cover() {
  const dispatch = useAppDispatch();
  const { status, data } = useAppSelector((state) => state.auth);

  const { values, errors, handleSubmit, handleChange, isSubmitting, touched, resetForm } =
    useFormik({
      validationSchema,
      initialValues: {
        fname: "",
        lname: "",
        phone_no: "",
        customer_code: "",
        email: "",
        password: "",
      },
      onSubmit: (validatedVal, { setSubmitting }) => {
        dispatch(signUp(validatedVal));
        setSubmitting(false);
      },
    });

  useEffect(() => {
    if (status === "succeeded") {
      resetForm();
    }
  }, [resetForm, status]);

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

        {status === "succeeded" && (
          <Alert
            severity="success"
            sx={() => ({
              width: "80%",
              margin: "0 auto",
            })}
          >
            <MDTypography variant="body2" fontSize={14}>
              {data.message || ""}
            </MDTypography>
          </Alert>
        )}

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
                name="phone_no"
                label="Phone Number"
                variant="standard"
                fullWidth
                placeholder="Eg: 09xxxxxxxxx"
                value={values.phone_no}
                error={touched.phone_no && Boolean(errors.phone_no)}
                helperText={touched.phone_no ? errors.phone_no : ""}
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
                name="customer_code"
                label="Company"
                variant="standard"
                fullWidth
                value={values.customer_code}
                error={touched.customer_code && Boolean(errors.customer_code)}
                helperText={touched.customer_code ? errors.customer_code : ""}
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
                disabled={isSubmitting}
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

export default Cover;
