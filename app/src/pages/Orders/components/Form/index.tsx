/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDatePicker from "atoms/MDatePicker";
import MDAlert2 from "atoms/MDAlert2";
import SkeletonForm from "organisms/Skeleton/Form";
import { Formik, Form, ArrayHelpers, FormikHelpers } from "formik";
import MDCheckbox from "atoms/MDCheckbox";
import MDSelect from "atoms/MDSelect";
import { ordersServices } from "services";
import { useId } from "hooks";
import selector from "selector";
import FormTable from "../FormTable";
import { IForm, IFormData } from "./type";
import validationSchema from "./validationSchema";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";

function FormRequests({
  open,
  onClose,
  // onUpdate,
  // data,
  warehouseList,
  isLoadingEdit,
  isLoadingUpdate,
  status,
  message,
}: IForm) {
  const autoId = useId();
  const { customerCode } = selector();
  const [materialList, setMaterialList] = useState([]);
  const [batchExpiryList, setBatchExpiryList] = useState([]);
  const [unitList, setUnitList] = useState({ 0: [] });

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

  const fetchMaterialDescription = useCallback(async () => {
    try {
      const { data: resp } = await ordersServices.getMaterialDescription({
        params: { customerCode },
      });
      if (resp) {
        setMaterialList(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [customerCode]);

  const fetchUnits = async (idx: number, materialCode: string) => {
    try {
      const { data: resp } = await ordersServices.getUnits({
        params: { materialCode },
      });
      if (resp) {
        const units = resp.data;
        setUnitList((prev) => ({ ...prev, [idx]: units }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBatchExpiry = useCallback(async () => {
    try {
      const { data: resp } = await ordersServices.getProductDetails({
        params: { customerCode, warehouseNo: "WH05" },
      });
      if (resp) {
        setBatchExpiryList(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [customerCode]);

  const clearUnits = (id: number) => {
    const unitListClone = unitList;
    if (unitListClone[id]) {
      delete unitListClone[id];

      //  Update unit list per row
      setUnitList(unitListClone);
    }
  };

  const handleMaterialCode = (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    id: number,
    index: number,
    setValues: FormikHelpers<IFormData>["setValues"]
  ) => {
    // Set data of material and unit dropdown
    if (reason === "selectOption" && value) {
      const { material, description } = value;
      fetchUnits(id, material);
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].material = material;
        clonePrev.requests[index].description = description;

        return clonePrev;
      });
    }

    // Clear data of material and unit dropdown
    if (reason === "clear") {
      clearUnits(id);
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].material = "";
        clonePrev.requests[index].description = "";

        return clonePrev;
      });
    }
  };

  const handleExpiryBatch = (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    index: number,
    setValues: FormikHelpers<IFormData>["setValues"]
  ) => {
    if (reason === "selectOption" && value) {
      const { expiry, batch } = value;
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = expiry;
        clonePrev.requests[index].batch = batch;

        return clonePrev;
      });
    }

    if (reason === "clear") {
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = "";
        clonePrev.requests[index].batch = "";

        return clonePrev;
      });
    }
  };

  const handleRemoveRow = (remove: ArrayHelpers["remove"], idx: number, id: number) => {
    clearUnits(id);

    // Remove row
    remove(idx);
  };

  const handleAddRow = (push: ArrayHelpers["push"]) => {
    push({ id: autoId(), search: "", material: "", description: "" });
  };

  useEffect(() => {
    if (open) {
      fetchMaterialDescription();
    }
  }, [fetchMaterialDescription, open]);

  useEffect(() => {
    if (open) {
      fetchBatchExpiry();
    }
  }, [fetchBatchExpiry, open]);

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      {isLoadingEdit ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <Formik
          // enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            id: "",
            ref_number: "",
            instruction: "",
            allow_notify: false,
            source_wh: "",
            requests: [
              {
                id: autoId(),
                search: "",
                material: "",
                description: "",
                qty: "",
                units: "",
                batch: "",
                expiry: "",
                available: "",
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
              <DialogTitle>Create Product Request</DialogTitle>
              {renderMessage()}
              <DialogContent sx={{ paddingTop: "20px !important" }}>
                <input type="hidden" value={formikProp.values.id} />

                <MDBox mb={1} display="flex" justifyContent="space-between">
                  <MDatePicker label="Pickup DateTime" onChange={() => console.log("date")} />
                  <MDSelect
                    name="source_wh"
                    label="Source warehouse"
                    variant="outlined"
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                    options={warehouseList}
                    value={formikProp.values.source_wh}
                    sx={{ width: 220 }}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>
                <MDBox mb={1} display="flex" justifyContent="space-between">
                  <MDInput
                    autoCapitalize="characters"
                    margin="dense"
                    name="ref_number"
                    label="Reference Number"
                    type="text"
                    variant="standard"
                    value={formikProp.values.ref_number}
                    error={formikProp.touched.ref_number && Boolean(formikProp.errors.ref_number)}
                    helperText={formikProp.touched.ref_number ? formikProp.errors.ref_number : ""}
                    onChange={formikProp.handleChange}
                  />

                  <MDCheckbox
                    label="Notify me every milestone"
                    name="allow_notify"
                    checked={formikProp.values.allow_notify}
                    onChange={formikProp.handleChange}
                    sx={{ "& span:last-child": { fontWeight: "400" }, justifyContent: "end" }}
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
                  <FormTable
                    {...formikProp}
                    materials={materialList}
                    batchExpiry={batchExpiryList}
                    units={unitList}
                    handleMaterialCode={handleMaterialCode}
                    handleExpiryBatch={handleExpiryBatch}
                    handleRemoveRow={handleRemoveRow}
                    handleAddRow={handleAddRow}
                  />
                </MDBox>
              </DialogContent>
              <DialogActions>
                <MDButton onClick={onClose}>Close</MDButton>
                <MDButton type="submit" disabled={isLoadingUpdate} loading={isLoadingUpdate}>
                  Save
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
