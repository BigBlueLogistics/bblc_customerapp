import { ChangeEvent, useCallback, useEffect, useState, ReactElement } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { CloseRounded as CloseIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { format, isValid } from "date-fns";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import MDInput from "atoms/MDInput";
import MDatePicker from "atoms/MDatePicker";
import MDAlert2 from "atoms/MDAlert2";
import SkeletonForm from "organisms/Skeleton/Form";
import FileUpload from "organisms/FileUpload";
import { Formik, Form, ArrayHelpers, FormikHelpers, FormikHandlers, FormikProps } from "formik";
import MDCheckbox from "atoms/MDCheckbox";
import MDSelect from "atoms/MDSelect";
import { ordersServices } from "services";
import selector from "selector";
import { TFormOrderState, TOrderData, TUploadFormOrderState } from "pages/Orders/types";
import { TAttachmentStatus } from "pages/Orders/data/types";
import { urls, files } from "constant";
import FormTable from "../FormTable";
import miscData from "../../data";
import { IForm } from "./types";
import validationSchema from "./validationSchema";
import { IAutoCompleteMaterialData } from "../AutoCompleteMaterial/types";
import { IAutoCompleteExpiryData } from "../AutoCompleteExpiry/types";
import { IAutoCompleteUnitsData } from "../AutoCompleteUnits/types";

function FormRequests({
  open,
  onClose,
  onSave,
  onUploadFile,
  onShowCancelConfirmation,
  data,
  fileUploadedData,
  inputFileRef,
  warehouseList,
}: IForm) {
  const { initialOrder, initialAttachment } = miscData();
  const initialRowId = uuidv4();
  initialOrder.requests[0].uuid = initialRowId;
  const { customerCode } = selector();
  const [materialList, setMaterialList] = useState([]);
  const [expiryBatchList, setExpiryBatchList] = useState({});
  const [unitList, setUnitList] = useState({});

  const [warehouseNo, setWarehouseNo] = useState("");
  const [selectedRowValues, setSelectedRowValues] = useState({});
  const [attachmentFile, setAttachmentFile] = useState<TAttachmentStatus>(initialAttachment);

  function renderMessage<T extends { [key: string]: any }>(msgData: T): ReactElement | null {
    const { message, status: formStatus, type } = msgData;
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
  }

  const fetchMaterialDescription = useCallback(async (code: string, warehouse: string) => {
    try {
      const { data: resp } = await ordersServices.getMaterialDescription({
        params: { customerCode: code, warehouseNo: warehouse },
      });
      if (resp) {
        setMaterialList(resp.data);
      }
    } catch (error) {
      /* empty */
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

  const computeAvailableQtyPerBatch = useCallback(
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
          let prevTotalQty = Number(totalQty || 0);
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
    setValues: FormikHelpers<TOrderData>["setValues"]
  ) => {
    // Set selected material.
    // And fetch units, expiry and batch.
    if (reason === "selectOption" && value) {
      const { material, description } = value;
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].material = material;
        clonePrev.requests[index].description = description;
        clonePrev.requests[index].units = "";
        clonePrev.requests[index].expiry = "";
        clonePrev.requests[index].batch = "";

        return clonePrev;
      });

      const units = await fetchUnits(material);
      const expiry = await fetchExpiryBatch(material, warehouseNo);
      setUnitList((prev) => ({ ...prev, [uuid]: units }));
      setExpiryBatchList((prev) => ({ ...prev, [uuid]: expiry }));

      // Auto-fill available qty
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].available = computeAllAvailableQty(expiry) as number;
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
        clonePrev.requests[index].qty = 0;
        clonePrev.requests[index].available = 0;

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
    setValues: FormikHelpers<TOrderData>["setValues"]
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

  const handleExpiryBatch = async (
    value: IAutoCompleteExpiryData & Partial<{ materialCode: string }>,
    reason: AutocompleteChangeReason,
    uuid: string,
    index: number,
    setValues: FormikHelpers<TOrderData>["setValues"]
  ) => {
    if (reason === "selectOption" && value) {
      const { expiry, batch } = value;
      const availabeQty = computeAvailableQtyPerBatch(uuid, expiry, batch);
      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = expiry;
        clonePrev.requests[index].batch = batch;
        clonePrev.requests[index].available = availabeQty;

        return clonePrev;
      });
    }

    if (reason === "clear") {
      const { materialCode } = value || {};
      const expiry = await fetchExpiryBatch(materialCode, warehouseNo);
      setExpiryBatchList((prev) => ({ ...prev, [uuid]: expiry }));

      setValues((prev) => {
        const clonePrev = prev;
        clonePrev.requests[index].expiry = "";
        clonePrev.requests[index].batch = "";
        clonePrev.requests[index].available = computeAllAvailableQty(expiry) as number;

        return clonePrev;
      });
    }
  };

  const handlePickupDate = (date: Date, setValues: FormikHelpers<TOrderData>["setValues"]) => {
    setValues((prev) => ({ ...prev, pickup_date: date }));
  };

  const handleWarehouseNo = (e: any, handleChange: FormikHandlers["handleChange"]) => {
    handleChange(e);
    setWarehouseNo(e.target.value);
  };

  const handleRemoveRow = (
    remove: ArrayHelpers["remove"],
    setValues: FormikHelpers<TOrderData>["setValues"],
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
    push({ ...initialOrder.requests[0], uuid });
  };

  const getAllUnits = async (orderData: TOrderData["requests"]) => {
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

  const getAllExpiryBatch = async (orderData: TOrderData["requests"], sourceWh: string) => {
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

  const getAllSelectedRowValues = (orderData: TOrderData["requests"]) => {
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
    (setValues: FormikProps<TOrderData>["setValues"]) => {
      const { type, data: tableData, status } = data;
      if (open && (type === "edit" || type === "view") && status === "succeeded" && tableData?.id) {
        setValues((prev) => {
          const cloneRequests = prev.requests;
          const newRequests = cloneRequests.map(({ uuid, expiry, batch }, idx) => {
            const availableQty = computeAvailableQtyPerBatch(uuid, expiry, batch);
            return {
              ...cloneRequests[idx],
              available: availableQty,
            };
          });

          return { ...prev, requests: newRequests };
        });
      }
    },
    [computeAvailableQtyPerBatch, data, open]
  );

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: selectedFiles } = e.currentTarget;
    let fileName = [];
    if (selectedFiles.length) {
      // eslint-disable-next-line no-plusplus
      for (let idx = 0; idx < selectedFiles.length; idx++) {
        const file = selectedFiles[idx];

        fileName[idx] = file;
      }
    } else {
      fileName = null;
    }

    // Selected files
    setAttachmentFile((prev) => ({ ...prev, upload: fileName }));
  };

  const handleDeleteFile = (file: string | File) => {
    setAttachmentFile((prev) => {
      const clonePrev = prev;
      // Remove filename from uploaded.
      if (clonePrev.uploaded) {
        clonePrev.uploaded = clonePrev.uploaded.filter((uploaded) => uploaded !== file);
      }

      // Store only string filename to delete on the server.
      if (typeof file === "string") {
        if (clonePrev.delete) {
          clonePrev.delete.push(file);
        } else {
          clonePrev.delete = [file];
        }
      }

      return { ...clonePrev };
    });
  };

  const onSaveFileUpload = () => {
    onUploadFile({
      attachment: attachmentFile.upload,
      attachmentDelete: attachmentFile.delete,
      customer_code: customerCode,
    });
  };

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
      setExpiryBatchList({});
      setUnitList({});
      setMaterialList([]);
      setAttachmentFile(initialAttachment);
    }
  }, [open]);

  useEffect(() => {
    const { type, status, data: orderData } = data || {};

    // Fetch data to edit the record.
    if ((type === "edit" || type === "view") && status === "succeeded" && orderData?.id) {
      const { source_wh: sourceWh, requests, attachment } = orderData;

      setWarehouseNo(sourceWh);
      getAllUnits(requests);
      getAllExpiryBatch(requests, sourceWh);
      getAllSelectedRowValues(requests);
      setAttachmentFile({ ...initialAttachment, uploaded: attachment || [] });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const { type, status, data: fileData } = fileUploadedData || {};

    // Update attachment state when uploaded
    if (fileData && type === "update" && status === "succeeded") {
      const { attachment } = fileData;
      setAttachmentFile({ ...initialAttachment, uploaded: attachment || [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUploadedData]);

  const isSaving =
    data.type !== "edit" && data.type !== "confirmation" && data.status === "loading";
  const isFetchingData =
    (data.type === "edit" || data.type === "view") && data.status === "loading";
  const isUpdate = data.type === "edit" || data.type === "update";
  const isCreate = data.type === "create";
  const isView = data.type === "view";
  const formHeaderTitle = isUpdate ? "update" : data.type;
  const canCancel = !isCreate && data.data?.status.id === 0;
  const isUploadingFile = fileUploadedData.status === "loading";
  const disabledUpload = (!attachmentFile.upload && !attachmentFile.delete) || isUploadingFile;

  const parseData = (orderData: TOrderData): TOrderData => {
    const cloneOrderData = orderData;
    if (orderData) {
      const pickupDate = orderData?.pickup_date ? new Date(orderData.pickup_date) : null;

      if (isValid(pickupDate)) {
        cloneOrderData.pickup_date = pickupDate;
      }
    }

    return { ...cloneOrderData };
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      {isFetchingData ? (
        <SkeletonForm contentWidth={300} />
      ) : (
        <Formik
          enableReinitialize={data.type === "edit" || data.type === "view"}
          validationSchema={validationSchema}
          initialValues={data.type === "create" ? initialOrder : parseData(data.data)}
          onSubmit={(validatedData: TOrderData, actions) => {
            const formattedPickupDate = format(validatedData.pickup_date, "MM/dd/yyyy HH:mm:ss");
            onSave(
              {
                ...validatedData,
                customer_code: customerCode,
                pickup_date: formattedPickupDate as unknown as Date,
              },
              actions
            );
          }}
        >
          {(formikProp) => (
            <Form role="form" onSubmit={formikProp.handleSubmit}>
              <DialogTitle sx={{ textTransform: "capitalize" }}>
                {formHeaderTitle} Product Request
                <IconButton
                  aria-label="close"
                  onClick={onClose}
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
              {renderMessage<TFormOrderState>(data)}
              {renderMessage<TUploadFormOrderState>(fileUploadedData)}
              <DialogContent
                sx={{ paddingTop: "20px !important", pointerEvents: isView ? "none" : "unset" }}
              >
                <input type="hidden" value={formikProp.values?.id || ""} />

                <MDBox mb={1} display="flex" justifyContent="space-between" alignItems="baseline">
                  <MDSelect
                    name="source_wh"
                    label="Source warehouse"
                    options={warehouseList}
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                    error={formikProp.touched.source_wh && Boolean(formikProp.errors.source_wh)}
                    helperText={formikProp.touched.source_wh ? formikProp.errors.source_wh : ""}
                    value={formikProp.values?.source_wh}
                    sx={{ width: 212, marginLeft: 0 }}
                    onChange={(e) => handleWarehouseNo(e, formikProp.handleChange)}
                  />
                  <MDInput
                    autoCapitalize="characters"
                    fullWidth
                    sx={{ width: 212 }}
                    margin="dense"
                    name="ref_number"
                    label="Reference Number"
                    type="text"
                    variant="standard"
                    autoComplete="off"
                    value={formikProp.values?.ref_number || ""}
                    error={formikProp.touched.ref_number && Boolean(formikProp.errors.ref_number)}
                    helperText={formikProp.touched.ref_number ? formikProp.errors.ref_number : ""}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>
                <MDBox mb={1} display="flex" justifyContent="space-between" alignItems="baseline">
                  <MDatePicker
                    label="Pickup DateTime"
                    name="pickup_date"
                    autoComplete="off"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    showTimeInput
                    minDate={new Date()}
                    selected={formikProp.values?.pickup_date}
                    onChange={(date: Date) => handlePickupDate(date, formikProp.setValues)}
                    inputStyle={{ width: 212 }}
                  />

                  <MDCheckbox
                    label="Notify me every milestone"
                    name="allow_notify"
                    checked={formikProp.values?.allow_notify}
                    onChange={formikProp.handleChange}
                    sx={{
                      "& span:last-child": { fontWeight: "400" },
                      alignSelf: "flex-end",
                    }}
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
                    error={formikProp.touched.instruction && Boolean(formikProp.errors.instruction)}
                    helperText={formikProp.touched.instruction ? formikProp.errors.instruction : ""}
                    value={formikProp.values?.instruction || ""}
                    onChange={formikProp.handleChange}
                  />
                </MDBox>
                {!isView ? (
                  <MDBox mb={1.5}>
                    <MDBox
                      component="a"
                      href={`${urls().TEMPLATE_ORDER_FORM_URL}`}
                      sx={{ width: "max-content", display: "block" }}
                    >
                      <MDTypography
                        sx={({ typography: { pxToRem }, palette: { text } }) => ({
                          fontSize: pxToRem(12),
                          textDecoration: "underline!important",
                          color: text.main,
                        })}
                      >
                        Download {files().TEMPLATE_ORDER_FORM}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                ) : null}

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
                <MDBox display="inline-flex">
                  {!isView ? (
                    <FileUpload
                      ref={inputFileRef}
                      formikProps={formikProp}
                      name="attachment[]"
                      accept=".xlsx"
                      multiple
                      disabledUpload={disabledUpload}
                      loading={isUploadingFile}
                      localFiles={attachmentFile.upload}
                      remoteFiles={attachmentFile.uploaded}
                      showRemoteFiles={isUpdate || isView}
                      onChange={handleChangeFile}
                      onUpload={onSaveFileUpload}
                      onDelete={handleDeleteFile}
                    />
                  ) : null}

                  {canCancel || !isView ? (
                    <MDButton
                      color="success"
                      type="submit"
                      sx={{ marginLeft: 1.5 }}
                      disabled={isSaving || !formikProp.dirty}
                      loading={isSaving}
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
