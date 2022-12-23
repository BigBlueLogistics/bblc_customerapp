/* eslint-disable @typescript-eslint/no-unused-vars */
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDatePicker from "atoms/MDatePicker";
import MDAlert2 from "atoms/MDAlert2";
import SkeletonForm from "organisms/Skeleton/Form";
import { Formik, Form } from "formik";
import FormTable from "../FormTable";
import { IForm } from "./type";
import validationSchema from "./validationSchema";

function FormRequests({
  open,
  onClose,
  onUpdate,
  data,
  isLoadingEdit,
  isLoadingUpdate,
  status,
  message,
}: IForm) {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {isLoadingEdit ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <Formik
          // enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            id: "",
            po_number: "",
            po_date: "",
            instruction: "",
            requests: [
              {
                search: "",
                material: "",
                description: "",
              },
            ],
          }}
          onSubmit={(validatedVal) => {
            console.log(validatedVal);

            // onUpdate(1, {});
          }}
        >
          {(formikProp) => (
            <Form role="form" onSubmit={formikProp.handleSubmit}>
              <DialogTitle>Update Product Request</DialogTitle>
              {renderMessage()}
              <DialogContent sx={{ paddingTop: "20px !important" }}>
                <input type="hidden" value={formikProp.values.id} />

                <MDBox mb={1}>
                  <MDatePicker label="Pickup DateTime" onChange={() => console.log("date")} />
                </MDBox>
                <MDBox mb={1} display="flex" justifyContent="space-between">
                  <MDInput
                    autoCapitalize="characters"
                    margin="dense"
                    name="po_number"
                    label="P.O Number"
                    type="text"
                    variant="standard"
                    value={formikProp.values.po_number}
                    error={formikProp.touched.po_number && Boolean(formikProp.errors.po_number)}
                    helperText={formikProp.touched.po_number ? formikProp.errors.po_number : ""}
                    onChange={formikProp.handleChange}
                  />
                  <MDInput
                    autoCapitalize="characters"
                    margin="dense"
                    name="po_date"
                    label="P.O Date"
                    type="text"
                    variant="standard"
                    value={formikProp.values.po_date}
                    error={formikProp.touched.po_date && Boolean(formikProp.errors.po_date)}
                    helperText={formikProp.touched.po_date ? formikProp.errors.po_date : ""}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>
                <MDBox mb={1}>
                  <MDInput
                    margin="dense"
                    name="instruction"
                    label="Special Instruction"
                    type="text"
                    minRows={2}
                    multiline
                    fullWidth
                    variant="standard"
                    value={formikProp.values.instruction}
                    error={formikProp.touched.instruction && Boolean(formikProp.errors.instruction)}
                    helperText={formikProp.touched.instruction ? formikProp.errors.instruction : ""}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>

                <MDBox mb={1}>
                  <FormTable {...formikProp} />
                </MDBox>
              </DialogContent>
              <DialogActions>
                <MDButton onClick={onClose}>Close</MDButton>
                <MDButton type="submit" disabled={isLoadingUpdate} loading={isLoadingUpdate}>
                  Update
                </MDButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}

export default FormRequests;
