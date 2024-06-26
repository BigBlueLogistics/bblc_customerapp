import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDButton from "atoms/MDButton";
import MDInput from "atoms/MDInput";

import { useFormik } from "formik";
import { TMain } from "./types";
import validationSchema, { TValidationSchema } from "./validationSchema";

function Main({ data, title, onUpdateProfile, shadow = true }: TMain) {
  const { data: viewProfile, status } = data;
  const { values, handleSubmit, handleChange, touched, errors } = useFormik<TValidationSchema>({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      phone_num: viewProfile?.phone_num || "",
      van_status: viewProfile?.van_status || false,
      invnt_report: viewProfile?.invnt_report || false,
    },
    onSubmit: (validatedVal) => {
      onUpdateProfile(validatedVal, false);
    },
  });
  return (
    <Card sx={{ width: "100%", height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2} component="form" role="form" onSubmit={handleSubmit}>
        <MDBox mb={2}>
          <MDInput
            type="text"
            name="phone_num"
            label="Phone Number"
            variant="standard"
            fullWidth
            placeholder="Eg: 09xxxxxxxxx"
            value={values.phone_num}
            error={touched.phone_num && Boolean(errors.phone_num)}
            helperText={touched.phone_num ? (errors.phone_num as string) : ""}
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
        <MDBox mb={2}>
          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            disabled={status === "loading"}
            loading={status === "loading"}
          >
            Save
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Main;
