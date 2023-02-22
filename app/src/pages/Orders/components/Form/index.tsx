/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Formik,
  Form,
  ArrayHelpers,
  FormikHelpers,
  FormikHandlers,
  FormikFormProps,
  FormikProps,
} from "formik";
import MDCheckbox from "atoms/MDCheckbox";
import MDSelect from "atoms/MDSelect";
import { ordersServices } from "services";
import { useId } from "hooks";
import selector from "selector";
import { IFormOrderState, IOrderData } from "pages/Orders/types";
import FormTable from "../FormTable";
import { IForm } from "./types";
import validationSchema from "./validationSchema";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";

function FormRequests({ open, onClose, onSave, data, warehouseList }: IForm) {
  const autoId = useId();
  const initialRowId = autoId();
  const { customerCode } = selector();
  const [initialValues] = useState<IOrderData>({
    id: "",
    pickup_date: null,
    ref_number: "",
    instruction: "",
    allow_notify: false,
    source_wh: "",
    requests: [
      {
        id: initialRowId,
        material: "",
        description: "",
        qty: "",
        units: "",
        batch: "",
        expiry: "",
        available: "",
      },
    ],
  });
  const [materialList, setMaterialList] = useState([]);
  const [expiryBatchList, setExpiryBatchList] = useState({ [initialRowId]: [] });
  const [unitList, setUnitList] = useState({ [initialRowId]: [] });

  const [warehouseNo, setWarehouseNo] = useState("");
  // const [materialCode, setMaterialCode] = useState("");

  const renderMessage = () => {
    const { message, status: formStatus } = data;
    if (formStatus === "succeeded" || formStatus === "failed") {
      const severity = formStatus === "succeeded" ? "success" : "error";
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

  const fetchUnits = async (material: string) => {
    try {
      const { data: resp } = await ordersServices.getUnits({
        params: { materialCode: material },
      });
      return resp.data || [];
    } catch (error) {
      return error;
    }
  };

  const fetchExpiryBatch = async (material: string, sourceWh: string) => {
    try {
      const { data: resp } = await ordersServices.getExpiryBatch({
        params: { materialCode: material, warehouseNo: sourceWh },
      });
      return resp.data || [];
    } catch (error) {
      return error;
    }
  };

  const clearUnits = (id: string) => {
    const unitListClone = unitList;
    if (unitListClone[id]) {
      delete unitListClone[id];

      //  Update unit list per row
      setUnitList(unitListClone);
    }
  };

  const clearExpiryBatch = (id: string) => {
    const expiryListClone = expiryBatchList;
    if (expiryListClone[id]) {
      delete expiryListClone[id];

      // Update expiry/batch list per row
      setExpiryBatchList(expiryListClone);
    }
  };

  const handleMaterialCode = async (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    id: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => {
    // Set selected material.
    // And fetch units, expiry and batch.
    if (reason === "selectOption" && value) {
      const { material, description } = value;
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].material = material;
        clonePrev.requests[index].description = description;

        return clonePrev;
      });
      const units = await fetchUnits(material);
      const expiry = await fetchExpiryBatch(material, warehouseNo);
      setUnitList((prev) => ({ ...prev, [id]: units }));
      setExpiryBatchList((prev) => ({ ...prev, [id]: expiry }));
    }

    // Clear data of material and unit dropdown
    if (reason === "clear") {
      clearUnits(id);
      clearExpiryBatch(id);
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].material = "";
        clonePrev.requests[index].description = "";
        clonePrev.requests[index].units = "";
        clonePrev.requests[index].expiry = "";
        clonePrev.requests[index].batch = "";
        clonePrev.requests[index].available = "";

        return clonePrev;
      });
    }
  };

  const computeAvailableQty = useCallback(
    (id: string, selectedExpiry: string, selectedBatch: string) => {
      if (expiryBatchList[id]?.length) {
        return expiryBatchList[id].reduce((totalQty, current) => {
          let prevTotalQty = totalQty;

          if (selectedExpiry === current.expiry && selectedBatch === current.batch) {
            prevTotalQty += current.quantity;
          }

          return prevTotalQty;
        }, 0);
      }
      return 0;
    },
    [expiryBatchList]
  );

  const handleExpiryBatch = (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    id: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => {
    if (reason === "selectOption" && value) {
      const { expiry, batch } = value;
      const availabeQty = computeAvailableQty(id, expiry, batch);
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = expiry;
        clonePrev.requests[index].batch = batch;
        clonePrev.requests[index].available = availabeQty;

        return clonePrev;
      });
    }

    if (reason === "clear") {
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = "";
        clonePrev.requests[index].batch = "";
        clonePrev.requests[index].available = "";

        return clonePrev;
      });
    }
  };

  const handlePickupDate = (date: Date, setValues: FormikHelpers<IOrderData>["setValues"]) => {
    setValues((prev) => ({ ...prev, pickup_date: date }));
  };

  const handleWarehouseNo = (e: any, handleChange: FormikHandlers["handleChange"]) => {
    handleChange(e);
    setWarehouseNo(e.target.value);
  };

  const handleRemoveRow = (remove: ArrayHelpers["remove"], idx: number, id: string) => {
    clearUnits(id);
    clearExpiryBatch(id);

    // Remove row
    remove(idx);
  };

  const handleAddRow = (push: ArrayHelpers["push"]) => {
    push({
      ...initialValues.requests[0],
      id: autoId(),
    });
  };

  const pickupDateValue = (dateVal: Date) => {
    if (dateVal) {
      return new Date(dateVal);
    }
    return null;
  };

  const getAllUnits = async (orderData: IOrderData["requests"]) => {
    const allUnits = await Promise.all(
      orderData.map(async ({ id, material }) => {
        const unit = await fetchUnits(material);
        return {
          [id]: unit,
        };
      })
    );

    const objAllUnits = allUnits.reduce((prev, current) => {
      const [key, value] = Object.entries(current)[0];
      prev[key] = value;

      return prev;
    }, {});

    setUnitList(objAllUnits);
  };

  const getAllExpiryBatch = async (orderData: IOrderData["requests"], sourceWh: string) => {
    const allExpiry = await Promise.all(
      orderData.map(async ({ id, material }) => {
        const expiries = await fetchExpiryBatch(material, sourceWh);
        return {
          [id]: expiries,
        };
      })
    );

    const objAllExpiry = allExpiry.reduce((prev, current) => {
      const [key, value] = Object.entries(current)[0];
      prev[key] = value;

      return prev;
    }, {});

    setExpiryBatchList(objAllExpiry);
  };

  // TODO
  const onMountForm = useCallback(
    (setValues: FormikProps<IOrderData>["setValues"]) => {
      const { type, data: tableData, status } = data;
      if (type === "edit" && status === "succeeded" && tableData?.id) {
        setValues((prev) => {
          const cloneRequests = prev.requests;
          const newRequests = cloneRequests.map(({ id, expiry, batch }, idx) => {
            return {
              ...cloneRequests[idx],
              available: computeAvailableQty(id, expiry, batch),
            };
          });

          return { ...prev, requests: newRequests };
        });
      }
    },
    [computeAvailableQty, data]
  );

  useEffect(() => {
    if (open) {
      fetchMaterialDescription();
    }
  }, [fetchMaterialDescription, open]);

  useEffect(() => {
    const { type, status, data: orderData } = data || {};

    if (type === "edit" && status === "succeeded" && orderData?.id) {
      setWarehouseNo(orderData.source_wh);
      getAllUnits(orderData.requests);
      getAllExpiryBatch(orderData.requests, orderData.source_wh);
    }
  }, [data]);

  const isSaving = data.type !== "edit" && data.status === "loading";
  const isFetchingData = data.type === "edit" && data.status === "loading";

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      {isFetchingData ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <Formik
          enableReinitialize={data.type !== "add"}
          validationSchema={validationSchema}
          initialValues={data.type === "add" ? initialValues : data.data}
          onSubmit={(validatedData: IOrderData, actions) => {
            onSave(validatedData, actions);
          }}
        >
          {(formikProp) => (
            <Form role="form" onSubmit={formikProp.handleSubmit}>
              <DialogTitle>Create Product Request</DialogTitle>
              {renderMessage()}
              <DialogContent sx={{ paddingTop: "20px !important" }}>
                <input type="hidden" value={formikProp.values.id || ""} />

                <MDBox mb={1} display="flex" justifyContent="space-between">
                  <MDatePicker
                    label="Pickup DateTime"
                    name="pickup_date"
                    defaultValue={pickupDateValue(formikProp.values.pickup_date)}
                    onChange={(date) => handlePickupDate(date, formikProp.setValues)}
                  />
                  <MDSelect
                    name="source_wh"
                    label="Source warehouse"
                    variant="outlined"
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                    options={warehouseList}
                    value={formikProp.values.source_wh}
                    sx={{ width: 220 }}
                    onChange={(e) => handleWarehouseNo(e, formikProp.handleChange)}
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
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]{12}" }}
                    value={formikProp.values?.ref_number || ""}
                    error={formikProp.touched.ref_number && Boolean(formikProp.errors.ref_number)}
                    helperText={formikProp.touched.ref_number ? formikProp.errors.ref_number : ""}
                    onChange={formikProp.handleChange}
                  />

                  <MDCheckbox
                    label="Notify me every milestone"
                    name="allow_notify"
                    checked={formikProp.values?.allow_notify}
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
                    value={formikProp.values?.instruction || ""}
                    error={formikProp.touched.instruction && Boolean(formikProp.errors.instruction)}
                    helperText={formikProp.touched.instruction ? formikProp.errors.instruction : ""}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>

                <MDBox mb={1}>
                  <FormTable
                    {...formikProp}
                    materials={materialList}
                    expiryBatch={expiryBatchList}
                    units={unitList}
                    onMount={onMountForm}
                    handleMaterialCode={handleMaterialCode}
                    handleExpiryBatch={handleExpiryBatch}
                    handleRemoveRow={handleRemoveRow}
                    handleAddRow={handleAddRow}
                  />
                </MDBox>
              </DialogContent>
              <DialogActions>
                <MDButton onClick={onClose}>Close</MDButton>
                <MDButton
                  type="submit"
                  disabled={isSaving}
                  loading={isSaving}
                  onClick={formikProp.handleSubmit}
                >
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
