/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { TableContainer, Table, TableCell, TableHead, TableBody, TableRow } from "@mui/material";
import { FieldArray, FormikProps } from "formik";
import Icon from "@mui/material/Icon";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDSelect from "atoms/MDSelect";
import MDTypography from "atoms/MDTypography";
import { IOrderData } from "pages/Orders/types";
import AutoCompleteMaterial from "../AutoCompleteMaterial";
import AutoCompleteExpiry from "../AutoCompleteExpiry";
import { IFormTable } from "./types";

function FormTable(props: FormikProps<IOrderData> & IFormTable) {
  const {
    values,
    touched,
    handleChange,
    errors,
    units,
    materials,
    expiryBatch,
    onMount,
    setValues,
    handleMaterialCode,
    handleExpiryBatch,
    handleRemoveRow,
    handleAddRow,
  } = props;

  const tHeaders = [
    // "Search",
    "Material",
    "Units",
    "Expiry / Batch",
    "Quantity",
    "Available Quantity",
    "",
  ];

  useEffect(() => {
    if (values.id) {
      onMount(setValues);
    }
  }, [onMount, setValues, values.id]);

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
          <FieldArray
            name="requests"
            render={({ push, remove }) => (
              <>
                {values && values.requests.length
                  ? values.requests.map(({ uuid }, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableRow key={uuid}>
                        {/* <TableCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].search`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].search}
                            error={
                              touched?.requests && errors.requests
                                ? Boolean(errors.requests[index].search)
                                : false
                            }
                            helperText={
                              touched?.requests && errors.requests
                                ? errors.requests[index].search
                                : null
                            }
                            onChange={handleChange}
                          />
                        </TableCell> */}
                        <TableCell>
                          <AutoCompleteMaterial
                            index={index}
                            options={materials || []}
                            value={values.requests[index].material || ""}
                            onChange={(value, reason) =>
                              handleMaterialCode(value, reason, uuid, index, setValues)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <MDSelect
                            name={`requests[${index}].units`}
                            label="Select units"
                            variant="outlined"
                            withOptionKeys={false}
                            options={units[uuid] || []}
                            value={units[uuid]?.length ? values.requests[index].units : ""}
                            sx={{ width: "150px" }}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <AutoCompleteExpiry
                            index={index}
                            options={expiryBatch[uuid] || []}
                            value={expiryBatch[uuid]?.length ? values.requests[index].expiry : ""}
                            onChange={(value, reason) =>
                              handleExpiryBatch(value, reason, uuid, index, setValues)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].qty`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].qty || ""}
                            // error={
                            //   touched?.requests && errors.requests
                            //     ? Boolean(errors.requests[index].qty)
                            //     : false
                            // }
                            // helperText={
                            //   touched?.requests && errors.requests
                            //     ? errors.requests[index]?.qty
                            //     : null
                            // }
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <MDTypography
                            sx={({ typography: { pxToRem } }) => ({
                              fontSize: pxToRem(14),
                            })}
                          >
                            {values.requests[index].available || ""}
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDButton
                            iconOnly
                            onClick={() => handleRemoveRow(remove, index, uuid)}
                            sx={{
                              "&:hover": { backgroundColor: "#ffcbc4" },
                            }}
                          >
                            <Icon color="error" fontSize="large">
                              highlight_off
                            </Icon>
                          </MDButton>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}

                <TableRow>
                  <TableCell colSpan={tHeaders.length}>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleAddRow(push)}
                    >
                      Add row
                    </MDButton>
                  </TableCell>
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
