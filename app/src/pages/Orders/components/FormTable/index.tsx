/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  TableFooter,
} from "@mui/material";
import { FieldArray, FormikProps, FormikValues } from "formik";
import Icon from "@mui/material/Icon";
import MDInput from "atoms/MDInput";
import MDButton from "atoms/MDButton";

function FormTable(props: FormikProps<FormikValues>) {
  const { values, touched, handleChange, errors } = props;
  const tHeaders = [
    "Search",
    "Material",
    "Description",
    "Quantity",
    "Units",
    "Location",
    "Batch",
    "Expiry Date",
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
                  ? values.requests.map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].search`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].search}
                            error={
                              touched?.requests && errors.length
                                ? Boolean(errors.requests[index].search)
                                : false
                            }
                            helperText={
                              touched?.requests && errors.length
                                ? errors.requests[index].search
                                : null
                            }
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].material`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].material}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <MDInput
                            margin="dense"
                            name={`requests[${index}].description`}
                            type="text"
                            variant="standard"
                            value={values.requests[index].description}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <MDButton
                            iconOnly
                            onClick={() => remove(index)}
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
                      onClick={() => push({ search: "", material: "", description: "" })}
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
