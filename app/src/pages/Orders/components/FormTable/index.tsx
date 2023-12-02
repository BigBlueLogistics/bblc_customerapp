import { useEffect } from "react";
import { TableContainer, Table, TableCell, TableHead, TableBody, TableRow } from "@mui/material";
import { FieldArray, FormikProps } from "formik";
import Icon from "@mui/material/Icon";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import { TOrderData } from "pages/Orders/types";
import TableBodyCell from "./TableBodyCell";
import AutoCompleteMaterial from "../AutoCompleteMaterial";
import AutoCompleteUnits from "../AutoCompleteUnits";
import AutoCompleteExpiry from "../AutoCompleteExpiry";
import { IFormTable } from "./types";

function FormTable(props: FormikProps<TOrderData> & IFormTable) {
  const {
    values,
    touched,
    handleChange,
    errors,
    units,
    materials,
    expiryBatch,
    selectedRowValues,
    onMount,
    setValues,
    handleMaterialCode,
    handleUnits,
    handleExpiryBatch,
    handleRemoveRow,
    handleAddRow,
  } = props;

  const tHeaders = [
    "Material",
    "Units",
    "Expiry / Batch",
    "Quantity",
    "Available Quantity",
    "Remarks",
    "",
  ];

  useEffect(() => {
    if (values.id) {
      onMount(setValues);
    }
  }, [onMount, setValues, values.id]);

  const displayRowError = (idx: number, fieldName: string) => {
    if (
      touched?.requests &&
      errors?.requests &&
      Array.isArray(errors.requests) &&
      errors.requests.length &&
      typeof errors.requests[idx] === "object"
    ) {
      const fieldErrors = errors.requests[idx] as TOrderData["requests"];
      const fieldTouched = touched.requests[idx];
      if (fieldTouched?.[fieldName] && fieldErrors[fieldName]) {
        return fieldErrors[fieldName];
      }
      return "";
    }
    return "";
  };

  const renderMainError = () => {
    if (touched?.requests && errors?.requests && typeof errors?.requests === "string") {
      return (
        <TableRow>
          <TableBodyCell colSpan={tHeaders.length}>
            <MDTypography color="error" variant="caption">
              {errors.requests}
            </MDTypography>
          </TableBodyCell>
        </TableRow>
      );
    }

    return null;
  };

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {tHeaders.map((title) => (
              <TableCell key={title} variant="body">
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderMainError()}
          <FieldArray
            name="requests"
            render={({ push, remove }) => (
              <>
                {values && values.requests.length
                  ? values.requests.map(({ uuid, material, units: rowUnit }, index) => (
                      <TableRow key={uuid}>
                        <TableBodyCell>
                          <AutoCompleteMaterial
                            index={index}
                            options={materials || []}
                            value={values.requests[index].material || ""}
                            error={Boolean(displayRowError(index, "material"))}
                            helperText={displayRowError(index, "material")}
                            onChange={(value, reason) =>
                              handleMaterialCode(value, reason, uuid, index, setValues)
                            }
                          />
                        </TableBodyCell>
                        <TableBodyCell>
                          <AutoCompleteUnits
                            index={index}
                            options={units[uuid] || []}
                            value={units[uuid]?.length ? values.requests[index].units : ""}
                            error={Boolean(displayRowError(index, "units"))}
                            helperText={displayRowError(index, "units")}
                            onChange={(value, reason) =>
                              handleUnits(value, rowUnit, material, reason, index, setValues)
                            }
                            optionsDisabled={selectedRowValues[values.requests[index].material]}
                          />
                        </TableBodyCell>
                        <TableBodyCell>
                          <AutoCompleteExpiry
                            index={index}
                            options={expiryBatch[uuid] || []}
                            value={expiryBatch[uuid]?.length ? values.requests[index].expiry : ""}
                            onChange={(value, reason) =>
                              handleExpiryBatch(
                                { materialCode: values.requests[index].material, ...value },
                                reason,
                                uuid,
                                index,
                                setValues
                              )
                            }
                          />
                        </TableBodyCell>
                        <TableBodyCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].qty`}
                            type="text"
                            variant="standard"
                            autoComplete="off"
                            value={values.requests[index].qty || ""}
                            error={Boolean(displayRowError(index, "qty"))}
                            helperText={displayRowError(index, "qty")}
                            endAdornment={false}
                            onChange={handleChange}
                            sx={{ marginTop: "13px", marginBottom: 0 }}
                          />
                        </TableBodyCell>
                        <TableBodyCell>
                          <MDTypography
                            sx={({ typography: { pxToRem } }) => ({
                              fontSize: pxToRem(14),
                              textAlign: "center",
                            })}
                          >
                            {values.requests[index].available}
                          </MDTypography>
                        </TableBodyCell>
                        <TableBodyCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].remarks`}
                            type="text"
                            variant="standard"
                            autoComplete="off"
                            multiline
                            value={values.requests[index].remarks || ""}
                            error={Boolean(displayRowError(index, "remarks"))}
                            helperText={displayRowError(index, "remarks")}
                            endAdornment={false}
                            onChange={handleChange}
                            sx={{ marginTop: "13px", marginBottom: 0, width: 150 }}
                          />
                        </TableBodyCell>
                        <TableBodyCell>
                          <MDButton
                            iconOnly
                            onClick={() =>
                              handleRemoveRow(remove, setValues, index, uuid, material, rowUnit)
                            }
                            sx={{
                              "&:hover": { backgroundColor: "#ffcbc4" },
                            }}
                          >
                            <Icon color="error" fontSize="large">
                              highlight_off
                            </Icon>
                          </MDButton>
                        </TableBodyCell>
                      </TableRow>
                    ))
                  : null}

                <TableRow>
                  <TableBodyCell colSpan={tHeaders.length}>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleAddRow(push)}
                    >
                      Add row
                    </MDButton>
                  </TableBodyCell>
                </TableRow>
              </>
            )}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FormTable;
