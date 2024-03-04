/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close as CloseIcon, DeleteRounded } from "@mui/icons-material";
import { useFormik } from "formik";
import MDButton from "atoms/MDButton";
import MDInput from "atoms/MDInput";
import MDAlert2 from "atoms/MDAlert2";
import MDTypography from "atoms/MDTypography";
import { TMaintainNotices } from "./types";
import validationSchema, { TValidationNotices } from "./validationSchema";

function ModalMaintainNotices({
  data,
  open,
  onClose,
  onCreateNotices,
  onDeleteNotices,
}: TMaintainNotices) {
  const { status, type, message } = data;

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    dirty,
    setFieldValue,
    resetForm,
    isSubmitting,
    setSubmitting,
  } = useFormik<TValidationNotices>({
    validateOnChange: true,
    validationSchema,
    initialValues: {
      actionType: "",
      fname: "",
      lname: "",
      emailAdd: "",
      phoneNum: "",
    },
    onSubmit: (validatedData, formikHelper) => {
      if (validatedData.actionType === "create") {
        onCreateNotices(validatedData, formikHelper);
      }
      if (validatedData.actionType === "delete") {
        onDeleteNotices(validatedData, formikHelper);
      }
    },
  });

  const handleSubmitType = (actionType: TValidationNotices["actionType"]) => {
    setFieldValue("actionType", actionType, true);
    setSubmitting(true);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const renderMessage = () => {
    if (
      (type === "create" || type === "delete") &&
      (status === "succeeded" || status === "failed")
    ) {
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

  const isCreating = type === "create" && status === "loading";
  const isDeleting = type === "delete" && status === "loading";

  useEffect(() => {
    if (isSubmitting) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Maintain Notices Recipients{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          title="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {renderMessage()}
      <form style={{ paddingBlock: "10px 10px" }}>
        <DialogContent>
          <MDInput
            label="First name"
            type="text"
            name="fname"
            autoComplete="off"
            onChange={handleChange}
            value={values.fname}
            fullWidth
            sx={{ mb: 1.2 }}
            error={touched.fname && Boolean(errors.fname)}
            helperText={touched.fname ? errors.fname : ""}
          />
          <MDInput
            label="Last name"
            type="text"
            name="lname"
            autoComplete="off"
            onChange={handleChange}
            value={values.lname}
            fullWidth
            sx={{ mb: 1.2 }}
            error={touched.lname && Boolean(errors.lname)}
            helperText={touched.lname ? errors.lname : ""}
          />
          <MDInput
            label="Email address"
            type="email"
            name="emailAdd"
            autoComplete="off"
            onChange={handleChange}
            value={values.emailAdd}
            fullWidth
            sx={{ mb: 1.2 }}
            error={touched.emailAdd && Boolean(errors.emailAdd)}
            helperText={touched.emailAdd ? errors.emailAdd : ""}
          />
          <MDInput
            label="Phone number"
            type="text"
            name="phoneNum"
            autoComplete="off"
            placeholder="E.g: 09xxxxxxxxx"
            onChange={handleChange}
            value={values.phoneNum}
            fullWidth
            error={touched.phoneNum && Boolean(errors.phoneNum)}
            helperText={touched.phoneNum ? errors.phoneNum : ""}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <MDButton
            variant="gradient"
            color="error"
            disabled={isDeleting || !dirty || !values.phoneNum}
            startIcon={<DeleteRounded />}
            onClick={() => handleSubmitType("delete")}
            aria-label="Delete"
          >
            Delete
          </MDButton>
          <MDButton
            variant="gradient"
            color="info"
            disabled={isCreating || !dirty}
            loading={isCreating}
            onClick={() => handleSubmitType("create")}
            aria-label="Create"
          >
            Create
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModalMaintainNotices;
