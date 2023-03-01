import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { v4 as uuidv4 } from "uuid";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDatePicker from "atoms/MDatePicker";
import MDAlert2 from "atoms/MDAlert2";
import SkeletonForm from "organisms/Skeleton/Form";
import { Formik, Form, ArrayHelpers, FormikHelpers, FormikHandlers, FormikProps } from "formik";
import MDCheckbox from "atoms/MDCheckbox";
import MDSelect from "atoms/MDSelect";
import { ordersServices } from "services";
import selector from "selector";
import { IOrderData } from "pages/Orders/types";
import FormTable from "../FormTable";
import { IForm } from "./types";
import validationSchema from "./validationSchema";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteUnitsData } from "../AutoCompleteUnits/types";

function FormRequests({
  open,
  onClose,
  onSave,
  onShowCancelConfirmation,
  data,
  warehouseList,
}: IForm) {
  const initialRowId = uuidv4();
  const { customerCode } = selector();
  const [initialValues] = useState<IOrderData>({
    id: "",
    pickup_date: null,
    ref_number: "",
    instruction: "",
    allow_notify: false,
    source_wh: "",
    status: "",
    requests: [
      {
        uuid: initialRowId,
        material: "",
        description: "",
        qty: "",
        units: "",
        batch: "",
        expiry: "",
        available: "",
      },
    ],
    requestsDelete: [],
  });
  const [materialList, setMaterialList] = useState([]);
  const [expiryBatchList, setExpiryBatchList] = useState({ [initialRowId]: [] });
  const [unitList, setUnitList] = useState({ [initialRowId]: [] });

  const [warehouseNo, setWarehouseNo] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});

  const renderMessage = () => {
    const { message, status: formStatus, type } = data;
    if (
      (type === "create" || type === "update") &&
      (formStatus === "succeeded" || formStatus === "failed")
    ) {
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

  const fetchMaterialDescription = useCallback(async (code: string, warehouse: string) => {
    try {
      const { data: resp } = await ordersServices.getMaterialDescription({
        params: { customerCode: code, warehouseNo: warehouse },
      });
      if (resp) {
        setMaterialList(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  const clearUnits = (uuid: string) => {
    const unitListClone = unitList;
    if (unitListClone[uuid]) {
      delete unitListClone[uuid];

      //  Update unit list per row
      setUnitList(unitListClone);
    }
  };

  const clearExpiryBatch = (uuid: string) => {
    const expiryListClone = expiryBatchList;
    if (expiryListClone[uuid]) {
      delete expiryListClone[uuid];

      // Update expiry/batch list per row
      setExpiryBatchList(expiryListClone);
    }
  };

  const clearSelectedRowUnit = ({ material, unit }: { material: string; unit: string }) => {
    if (unit) {
      setSelectedRowValues((prev) => {
        const cloneMaterial = prev;

        if (cloneMaterial[material]?.length > 1) {
          const idxUnit = cloneMaterial[material].indexOf(unit);
          cloneMaterial[material].splice(idxUnit, 1);
        } else {
          delete cloneMaterial[material];
        }

        return cloneMaterial;
      });
    }
  };

  const computeAvailableQty = useCallback(
    (uuid: string, selectedExpiry: string, selectedBatch: string) => {
      if (expiryBatchList[uuid]?.length) {
        return expiryBatchList[uuid]
          .reduce((totalQty, current) => {
            let prevTotalQty = totalQty;

            if (selectedExpiry === current.expiry && selectedBatch === current.batch) {
              prevTotalQty += current.quantity;
            }

            return prevTotalQty;
          }, 0)
          .toFixed(3);
      }
      return 0;
    },
    [expiryBatchList]
  );

  const computeAllAvailableQty = (list: { [key: string]: any }[]) => {
    if (list?.length) {
      return list
        .reduce((totalQty, current) => {
          let prevTotalQty = Number(totalQty);
          prevTotalQty += current.quantity;

          return prevTotalQty;
        }, 0)
        .toFixed(3);
    }
    return 0;
  };

  const handleMaterialCode = async (
    value: IAutoCompleteMaterialData,
    reason: AutocompleteChangeReason,
    uuid: string,
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
      setUnitList((prev) => ({ ...prev, [uuid]: units }));
      setExpiryBatchList((prev) => ({ ...prev, [uuid]: expiry }));

      // Auto-fill available qty
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].available = computeAllAvailableQty(expiry);
        return clonePrev;
      });
    }

    // Clear data of material and unit dropdown
    if (reason === "clear") {
      clearUnits(uuid);
      clearExpiryBatch(uuid);
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

  const handleUnits = (
    value: IAutoCompleteUnitsData,
    prevValue: string,
    valueMaterial: string,
    reason: AutocompleteChangeReason,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => {
    if (reason === "selectOption" && value) {
      setSelectedRowValues((prev) => {
        let prevUnits = null;
        if (prev[valueMaterial]) {
          prevUnits = [...prev[valueMaterial], value];

          // Remove the previous value when changing option
          if (prevValue && prevValue !== value) {
            const idx = prevUnits.indexOf(prevValue);
            prevUnits.splice(idx, 1);
          }
        } else {
          prevUnits = [value];
        }

        return {
          ...prev,
          [valueMaterial]: prevUnits,
        };
      });
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].units = value;

        return clonePrev;
      });
    }

    if (reason === "clear") {
      clearSelectedRowUnit({ material: valueMaterial, unit: prevValue });
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].units = "";

        return clonePrev;
      });
    }
  };

  const handleExpiryBatch = (
    value: IAutoCompleteExpiryData,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<IOrderData>["setValues"]
  ) => {
    if (reason === "selectOption" && value) {
      const { expiry, batch } = value;
      const availabeQty = computeAvailableQty(uuid, expiry, batch);
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

  const handleRemoveRow = (
    remove: ArrayHelpers["remove"],
    setValues: FormikHelpers<IOrderData>["setValues"],
    idx: number,
    uuid: string,
    material: string,
    unit: string
  ) => {
    clearUnits(uuid);
    clearExpiryBatch(uuid);
    clearSelectedRowUnit({ material, unit });

    // Add the removed uuid
    setValues((prev) => {
      const canDeleteRequest = Boolean(prev.requests[idx]?.created_at);
      if (canDeleteRequest) {
        const requestsDelete = prev.requestsDelete ? [...prev.requestsDelete, uuid] : [uuid];
        return {
          ...prev,
          requestsDelete,
        };
      }

      return prev;
    });

    // Remove row
    remove(idx);
  };

  const handleAddRow = (push: ArrayHelpers["push"]) => {
    const uuid = uuidv4();
    push({
      material: "",
      description: "",
      qty: "",
      units: "",
      batch: "",
      expiry: "",
      available: "",
      uuid,
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
      orderData.map(async ({ uuid, material }) => {
        const unit = await fetchUnits(material);
        return {
          [uuid]: unit,
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
      orderData.map(async ({ uuid, material }) => {
        const expiries = await fetchExpiryBatch(material, sourceWh);
        return {
          [uuid]: expiries,
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

  const getAllSelectedRowValues = (orderData: IOrderData["requests"]) => {
    let selectedValues = {};
    if (orderData.length) {
      selectedValues = orderData.reduce((prev, { material, units }) => {
        const unitsValue = prev[material] ? [...prev[material], units] : [units];

        prev[material] = unitsValue;
        return prev;
      }, {});
    }
    setSelectedRowValues(selectedValues);
  };

  const onMountForm = useCallback(
    (setValues: FormikProps<IOrderData>["setValues"]) => {
      const { type, data: tableData, status } = data;
      if (type === "edit" && status === "succeeded" && tableData?.id) {
        setValues((prev) => {
          const cloneRequests = prev.requests;
          const newRequests = cloneRequests.map(({ uuid, expiry, batch }, idx) => {
            return {
              ...cloneRequests[idx],
              available: computeAvailableQty(uuid, expiry, batch),
            };
          });

          return { ...prev, requests: newRequests };
        });
      }
    },
    [computeAvailableQty, data]
  );

  // Open form
  useEffect(() => {
    if (open && customerCode && warehouseNo) {
      fetchMaterialDescription(customerCode, warehouseNo);
    }
  }, [fetchMaterialDescription, customerCode, warehouseNo, open]);

  // Close form
  useEffect(() => {
    if (!open) {
      setSelectedRowValues({});
    }
  }, [open]);

  // Fetching data when editing record
  useEffect(() => {
    const { type, status, data: orderData } = data || {};

    if (type === "edit" && status === "succeeded" && orderData?.id) {
      const { source_wh: sourceWh, requests } = orderData;
      setWarehouseNo(sourceWh);
      getAllUnits(requests);
      getAllExpiryBatch(requests, sourceWh);
      getAllSelectedRowValues(requests);
    }
  }, [data]);

  const isSaving = data.type !== "edit" && data.status === "loading";
  const isFetchingData = data.type === "edit" && data.status === "loading";
  const formHeaderTitle = data.type === "create" ? "Create" : "Update";
  const isUpdate = data.type === "edit" || data.type === "update";
  const canCancel = isUpdate && data.data?.status === "order create";

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      {isFetchingData ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <Formik
          enableReinitialize={data.type === "edit"}
          validationSchema={validationSchema}
          initialValues={data.type === "create" ? initialValues : data.data}
          onSubmit={(validatedData: IOrderData, actions) => {
            onSave(validatedData, actions);
          }}
        >
          {(formikProp) => (
            <Form role="form" onSubmit={formikProp.handleSubmit}>
              <DialogTitle>{formHeaderTitle} Product Request</DialogTitle>
              {renderMessage()}
              <DialogContent sx={{ paddingTop: "20px !important" }}>
                <input type="hidden" value={formikProp.values?.id || ""} />

                <MDBox mb={1} display="flex" justifyContent="space-between">
                  <MDatePicker
                    label="Pickup DateTime"
                    name="pickup_date"
                    autoComplete="off"
                    minDate={new Date()}
                    defaultValue={pickupDateValue(formikProp.values?.pickup_date)}
                    onChange={(date) => handlePickupDate(date, formikProp.setValues)}
                  />
                  <MDSelect
                    name="source_wh"
                    label="Source warehouse"
                    variant="outlined"
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                    error={formikProp.touched.source_wh && Boolean(formikProp.errors.source_wh)}
                    helperText={formikProp.touched.source_wh ? formikProp.errors.source_wh : ""}
                    options={warehouseList}
                    value={formikProp.values?.source_wh}
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
                    autoComplete="off"
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
                    onChange={formikProp.handleChange}
                  />
                </MDBox>

                <MDBox mb={1}>
                  <FormTable
                    {...formikProp}
                    materials={materialList}
                    expiryBatch={expiryBatchList}
                    units={unitList}
                    selectedRowValues={selectedRowValues}
                    onMount={onMountForm}
                    handleMaterialCode={handleMaterialCode}
                    handleUnits={handleUnits}
                    handleExpiryBatch={handleExpiryBatch}
                    handleRemoveRow={handleRemoveRow}
                    handleAddRow={handleAddRow}
                  />
                </MDBox>
              </DialogContent>
              <DialogActions sx={{ justifyContent: canCancel ? "space-between" : "flex-end" }}>
                {canCancel && (
                  <MDButton color="warning" onClick={() => onShowCancelConfirmation(data.id)}>
                    Cancel Request
                  </MDButton>
                )}
                <MDBox>
                  <MDButton color="error" onClick={onClose}>
                    Close
                  </MDButton>
                  {canCancel || !isUpdate ? (
                    <MDButton
                      color="success"
                      type="submit"
                      sx={{ marginLeft: 2 }}
                      disabled={isSaving}
                      loading={isSaving}
                      onClick={formikProp.handleSubmit}
                    >
                      Save
                    </MDButton>
                  ) : null}
                </MDBox>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}

export default FormRequests;
