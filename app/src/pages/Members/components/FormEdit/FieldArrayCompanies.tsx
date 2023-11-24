import { Icon, Tooltip } from "@mui/material";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDBox from "atoms/MDBox";
import { TValidationSchema } from "./validationSchema";
import { IFieldArrayCompanies } from "./types";

function FieldArrayCompanies({ arrayHelper, formik, onDeleteCompanies }: IFieldArrayCompanies) {
  const { values, touched, errors, handleChange } = formik;

  const displayRowError = (idx: number, fieldName: string) => {
    if (
      touched?.companies &&
      errors?.companies &&
      Array.isArray(errors?.companies) &&
      errors?.companies.length &&
      typeof errors?.companies[idx] === "object"
    ) {
      const fieldErrors = errors?.companies[idx] as TValidationSchema["companies"];
      const fieldTouched = touched?.companies[idx];
      if (fieldTouched?.[fieldName] && fieldErrors[fieldName]) {
        return fieldErrors[fieldName];
      }
      return "";
    }
    return "";
  };

  const handleDeleteCompanies = (idx: number, companyId: number) => {
    arrayHelper.remove(idx);
    onDeleteCompanies(companyId);
  };

  const renderInputCompanies = () =>
    values.companies.map((company, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <MDBox key={idx} display="flex" alignItems="stretch" justifyContent="space-between">
        <input
          type="hidden"
          name={`companies[${idx}].id`}
          value={values.companies[idx].id}
          onChange={handleChange}
        />
        <MDInput
          autoCapitalize="characters"
          margin="dense"
          name={`companies[${idx}].customer_code`}
          label="Customer code"
          type="text"
          fullWidth
          variant="standard"
          value={values.companies[idx].customer_code}
          error={Boolean(displayRowError(idx, "customer_code"))}
          helperText={displayRowError(idx, "customer_code")}
          onChange={handleChange}
          sx={{ marginTop: 0 }}
          inputProps={{ style: { textTransform: "uppercase" } }}
        />

        <MDInput
          autoCapitalize="characters"
          margin="dense"
          name={`companies[${idx}].company`}
          label="Company"
          type="text"
          fullWidth
          variant="standard"
          value={values.companies[idx].company}
          error={Boolean(displayRowError(idx, "company"))}
          helperText={displayRowError(idx, "company")}
          onChange={handleChange}
          sx={{ marginTop: 0 }}
        />

        {values.companies.length > 1 ? (
          <Tooltip title="Delete?" placement="top">
            <MDButton
              iconOnly
              onClick={() => handleDeleteCompanies(idx, Number(company.id))}
              size="small"
              sx={({ typography: { pxToRem } }) => ({
                borderRadius: "4px",
                backgroundColor: "rgba(245, 173, 163, 0.6)",
                height: "inherit",
                alignSelf: "stretch",
                marginBottom: "4px",
                maxHeight: pxToRem(44.8),
                "&:hover": {
                  backgroundColor: "rgba(245, 173, 163, 1)",
                  transition: "0.5s ease-out",
                },
                "&:active, &:focus": {
                  backgroundColor: "rgba(245, 173, 163, 1) !important",
                  transition: "0.5s ease-in",
                },
              })}
            >
              <Icon color="error" fontSize="large">
                delete_forever
              </Icon>
            </MDButton>
          </Tooltip>
        ) : null}
      </MDBox>
    ));

  return (
    <>
      {renderInputCompanies()}
      {values.companies.length < 4 ? (
        <MDButton
          variant="outlined"
          color="info"
          size="small"
          onClick={() => arrayHelper.push({ id: "", customer_code: "", company: "" })}
        >
          Add row
        </MDButton>
      ) : null}
    </>
  );
}

export default FieldArrayCompanies;
