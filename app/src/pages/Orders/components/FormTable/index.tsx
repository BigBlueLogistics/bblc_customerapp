/* eslint-disable @typescript-eslint/no-unused-vars */

import { TableContainer, Table, TableCell, TableHead, TableBody, TableRow } from "@mui/material";
import { FieldArray, FormikProps, FormikValues } from "formik";
import Icon from "@mui/material/Icon";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";
import MDSelect from "atoms/MDSelect";
import AutoCompleteMaterial from "../AutoCompleteMaterial";
import AutoCompleteExpiry from "../AutoCompleteExpiry";
import { IFormTable } from "./types";
import { IFormData } from "../Form/type";

function FormTable(props: FormikProps<IFormData> & IFormTable) {
  const {
    values,
    touched,
    handleChange,
    errors,
    units,
    materials,
    batchExpiry,
    setValues,
    handleMaterialCode,
    handleExpiryBatch,
    handleRemoveRow,
    handleAddRow,
  } = props;

  const tHeaders = [
    "Search",
    "Material",
    "Quantity",
    "Units",
    "Expiry / Batch",
    "Available Quantity",
    "",
  ];

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
                {values.requests.length
                  ? values.requests.map(({ id }, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableRow key={id}>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <AutoCompleteMaterial
                            index={index}
                            options={materials}
                            value={values.requests[index].material || ""}
                            onChange={(value, reason) =>
                              handleMaterialCode(value, reason, id, index, setValues)
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
                          <MDSelect
                            name={`requests[${index}].units`}
                            label="Select units"
                            variant="outlined"
                            withOptionKeys={false}
                            options={units[id]}
                            value={values.requests[index].units || ""}
                            sx={{ width: "150px" }}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <AutoCompleteExpiry
                            index={index}
                            options={batchExpiry}
                            value={values.requests[index].expiry || ""}
                            onChange={(value, reason) =>
                              handleExpiryBatch(value, reason, index, setValues)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <MDInput
                            disabled
                            margin="dense"
                            name={`requests[${index}].available`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].available || ""}
                            // error={
                            //   touched?.requests && errors.requests
                            //     ? Boolean(errors.requests[index]?.qty)
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
                          <MDButton
                            iconOnly
                            onClick={() => handleRemoveRow(remove, index, id)}
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
