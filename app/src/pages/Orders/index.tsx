import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormikHelpers } from "formik";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import MDatePicker from "atoms/MDatePicker";
import MDButton from "atoms/MDButton";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import { inventoryServices, ordersServices } from "services";
import { AxiosError } from "axios";
import miscData from "./data";
import { TNotifyOrder, TOrderData, TFormOrderState, TTableOrder, TFiltered } from "./types";
import Form from "./components/Form";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { TMenuAction } from "./components/MenuAction/types";
import CancelConfirmation from "./components/CancelConfirmation";
import StatusUpdate from "./components/StatusUpdate";

function Orders() {
  const dispatch = useAppDispatch();
  const { tableHeaders, initialFiltered, initialNotification, initialOutboundDetails } = miscData();
  const [showNotify, setShowNotify] = useState<TNotifyOrder>(initialNotification);
  const [showForm, setShowForm] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [action, setAction] = useState(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [filtered, setFiltered] = useState<TFiltered>(initialFiltered);
  const [outboundDetails, setOutboundDetails] = useState(initialOutboundDetails);

  const [tableOrders, setTableOrders] = useState<TTableOrder>({
    message: "",
    data: [],
    status: "idle",
  });

  const [formOrder, setFormOrder] = useState<TFormOrderState>({
    message: "",
    data: null,
    status: "idle",
    type: "",
    id: "",
    openConfirmation: false,
  });

  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotify = ({ open, message, title, color }: TNotifyOrder) => {
    setShowNotify({ open, message, title, color });
  };
  const closeNotify = () => {
    setShowNotify((prevState) => ({ ...prevState, open: false }));
  };

  const onShowForm = () => {
    setShowForm(true);
  };

  const onCloseForm = () => {
    setShowForm(false);
  };

  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, status: e.target.value }));
  };

  const onCreatedAt = (date: Date) => {
    setFiltered((prev) => ({ ...prev, createdAt: date }));
  };

  const onLastModified = (date: Date) => {
    setFiltered((prev) => ({ ...prev, lastModified: date }));
  };

  const onToggleFilter = () => {
    setToggleFilter((prev) => !prev);
  };

  const onShowStatusUpdate = () => {
    setShowStatusUpdate(true);
  };

  const onCloseStatusUpdate = () => {
    setShowStatusUpdate(false);
    setOutboundDetails(initialOutboundDetails);
  };

  const fetchOrderList = async ({ status, createdAt, lastModified }: TFiltered) => {
    setTableOrders((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await ordersServices.getOrderList({
        params: {
          status: String(status) || null,
          created_at: createdAt?.toLocaleDateString(),
          last_modified: lastModified?.toLocaleDateString(),
        },
      });
      setTableOrders({
        status: "succeeded",
        data: rows.data,
        message: rows.data.message,
      });
    } catch (err) {
      setTableOrders({ status: "failed", message: err.message, data: [] });
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList(rows.data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchStatusList = async () => {
    try {
      const { data: rows } = await ordersServices.getStatusList();

      setStatusList(rows.data);
    } catch (err) {
      setError(err);
    }
  };

  const onRefresh = () => {
    fetchOrderList(filtered);
    closeAction();
  };

  const onFilter = () => {
    fetchOrderList(filtered);
  };

  const onClear = () => {
    setFiltered(initialFiltered);
    fetchOrderList(initialFiltered);
  };

  const onCreate = () => {
    onShowForm();
    setFormOrder({
      message: "",
      data: null,
      status: "idle",
      type: "create",
      id: "",
      openConfirmation: false,
    });
  };

  const onShowCancelConfirmation = (transId: string) => {
    setFormOrder((prev) => ({
      ...prev,
      status: "idle",
      type: "confirmation",
      openConfirmation: true,
      id: transId,
    }));
  };

  const onCloseCancelConfirmation = () => {
    setFormOrder((prev) => ({
      ...prev,
      openConfirmation: false,
    }));
  };

  const onCancelOrderYes = async (transId: string) => {
    setFormOrder((prev) => ({ ...prev, message: "", status: "loading" }));
    try {
      const { data } = await ordersServices.cancelOrder(transId);
      setFormOrder((prev) => ({
        ...prev,
        type: "cancel",
        openConfirmation: false,
        message: data.message,
        status: "succeeded",
      }));
      onCloseForm();
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  const onSave = async (orderData: TOrderData, actions: FormikHelpers<TOrderData>) => {
    try {
      if (formOrder.type === "create") {
        setFormOrder((prev) => ({ ...prev, message: "", data: null, status: "loading" }));
        const {
          data: { message, data },
        } = await ordersServices.createOrder(orderData);
        setFormOrder((prev) => ({ ...prev, message, id: data.id, status: "succeeded" }));
        actions.resetForm();
        onCloseForm();
      } else if (formOrder.type === "edit" || formOrder.type === "update") {
        setFormOrder((prev) => ({ ...prev, message: "", type: "update", status: "loading" }));
        const {
          data: { message },
        } = await ordersServices.updateOrder(formOrder.id, orderData);
        setFormOrder((prev) => ({ ...prev, message, status: "succeeded" }));
      }
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  const onShowEdit = async (transId: string, type: TFormOrderState["type"]) => {
    onShowForm();
    setFormOrder((prev) => ({ ...prev, type, message: "", data: null, status: "loading" }));
    try {
      const { data } = await ordersServices.getOrderById(transId);
      setFormOrder((prev) => ({ ...prev, data: data.data, status: "succeeded", id: transId }));
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  const fetchOutboundDetails = async (docNo: string) => {
    setOutboundDetails((prev) => ({ ...prev, status: "loading", action: "edit" }));

    try {
      const { data: row } = await ordersServices.getAdhocOutbound(docNo);
      setOutboundDetails((prev) => ({
        ...prev,
        status: "succeeded",
        data: row.data,
        message: row.message,
      }));
    } catch (err) {
      setOutboundDetails({ status: "failed", message: err.message, data: null, action: null });
    }
  };

  const onCreateOutboundDetails = async (docNo: string) => {
    setOutboundDetails((prev) => ({ ...prev, status: "loading", action: "create" }));

    try {
      const {
        data: { info, status },
      } = outboundDetails;

      const params = {
        docNo,
        customerCode: info?.customerCode,
        createdDate: info?.createdDate,
        createdTime: info?.createdTime,
        createdBy: info?.createdBy,
        soNum: info?.soNum,
        warehouse: info?.warehouse,
        status,
        date: info?.date,
      };

      const { data } = await ordersServices.createOutboundDetails(params);
      setOutboundDetails((prev) => ({
        ...prev,
        status: "succeeded",
        data,
        message: data.message,
      }));
    } catch (err) {
      setOutboundDetails({ status: "failed", message: err.message, data: null, action: null });
    }
  };

  // Refresh order list after create, update and cancel.
  useEffect(() => {
    const { status, type } = formOrder;
    if ((type === "create" || type === "update" || type === "cancel") && status === "succeeded") {
      fetchOrderList(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOrder]);

  useEffect(() => {
    fetchOrderList(initialFiltered);
    fetchWarehouseList();
    fetchStatusList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const {
      status: orderStatus,
      id: orderTransid,
      message: orderMessage,
      type: orderType,
    } = formOrder;

    if (!showForm && orderType === "cancel" && orderStatus === "succeeded") {
      openNotify({
        open: true,
        message: `Transaction No. ${orderTransid}`,
        title: "Cancelled request",
        color: "warning",
      });
    }

    if (!showForm && orderType === "create" && orderStatus === "succeeded") {
      openNotify({
        open: true,
        message: `Transaction No. ${orderTransid}`,
        title: orderMessage,
        color: "success",
      });
    }
  }, [showForm, formOrder]);

  const menuItemsAction: TMenuAction["items"] = [
    {
      icon: (
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          refresh
        </Icon>
      ),
      label: "Refresh",
      onClick: onRefresh,
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {tableOrders.status === "failed" && (
        <MDTypography variant="body2">{tableOrders.message}</MDTypography>
      )}

      <MDSnackbar
        color={showNotify.color}
        icon="info"
        title={showNotify.title}
        content={showNotify.message}
        dateTime="now"
        open={showNotify.open}
        close={closeNotify}
      />

      <Form
        open={showForm}
        onClose={onCloseForm}
        onSave={onSave}
        data={formOrder}
        warehouseList={warehouseList}
        onShowCancelConfirmation={onShowCancelConfirmation}
      />

      <CancelConfirmation
        openConfirmation={formOrder.openConfirmation}
        transId={formOrder.id}
        isLoading={formOrder.status === "loading"}
        OnCancelYes={onCancelOrderYes}
        OnCancelNo={onCloseCancelConfirmation}
      />

      <StatusUpdate
        data={outboundDetails}
        open={showStatusUpdate}
        onClose={onCloseStatusUpdate}
        onGetOutbound={fetchOutboundDetails}
        onCreateOutbound={onCreateOutboundDetails}
      />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2.5}
                px={1.5}
                display="flex"
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                borderTop="2px solid #dadcde"
              >
                <MDTypography ml={3} variant="h4" color="light" textTransform="uppercase">
                  Product Request
                </MDTypography>

                <MDBox my="auto" marginLeft="auto">
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={onCreate}
                    sx={{ marginRight: "20px" }}
                  >
                    Create new
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    size="small"
                    onClick={onShowStatusUpdate}
                    sx={{ marginRight: "20px" }}
                  >
                    Status update
                  </MDButton>
                  <ActionIcon
                    title={toggleFilter ? "close filter" : "open filter"}
                    onClick={onToggleFilter}
                  >
                    {toggleFilter ? "search_off" : "search"}
                  </ActionIcon>
                  <ActionIcon title="actions" onClick={openAction}>
                    more_vert
                  </ActionIcon>
                  <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <MDBox
                  sx={({ palette: { grey } }) => ({
                    display: toggleFilter ? "block" : "none",
                    backgroundColor: grey[200],
                    borderTop: `2px solid ${grey[400]}`,
                    width: "100%",
                    overflowX: "auto",
                  })}
                >
                  <MDBox
                    sx={({ breakpoints }) => ({
                      marginRight: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "10px",
                      [breakpoints.down("md")]: {
                        justifyContent: "space-between",
                      },
                    })}
                  >
                    <MDSelect
                      label="Status"
                      variant="outlined"
                      onChange={onChangeStatus}
                      options={statusList}
                      value={filtered.status}
                      showArrowIcon
                      optKeyValue="id"
                      optKeyLabel="name"
                      itemStyle={{
                        textTransform: "uppercase",
                      }}
                      sx={{ marginRight: "8px" }}
                    />

                    <MDBox>
                      <MDatePicker
                        label="Created at"
                        onChange={onCreatedAt}
                        inputVariant="outlined"
                        dateFormat="MM/dd/yyyy"
                        minTime={new Date()}
                        selected={filtered.createdAt}
                        sx={{ marginRight: "8px" }}
                        inputStyle={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
                      />
                    </MDBox>

                    <MDBox>
                      <MDatePicker
                        label="Last modified"
                        onChange={onLastModified}
                        inputVariant="outlined"
                        dateFormat="MM/dd/yyyy"
                        selected={filtered.lastModified}
                        sx={{ marginRight: "12px" }}
                        inputStyle={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
                      />
                    </MDBox>

                    <MDButton
                      disabled={tableOrders.status === "loading"}
                      sx={{ marginRight: "12px" }}
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={onFilter}
                    >
                      Filter
                    </MDButton>
                    <MDButton
                      disabled={tableOrders.status === "loading"}
                      size="small"
                      variant="gradient"
                      color="warning"
                      onClick={onClear}
                    >
                      clear
                    </MDButton>
                  </MDBox>
                </MDBox>
                <DataTable
                  table={{
                    columns: tableHeaders({ onShowEdit, onShowCancelConfirmation }),
                    rows: tableOrders.data,
                  }}
                  isSorted={false}
                  isLoading={tableOrders.status === "loading"}
                  entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
                  showTotalEntries
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Orders;
