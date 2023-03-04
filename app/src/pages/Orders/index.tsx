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
import {
  INotifyOrder,
  IOrderData,
  IFormOrderState,
  ITableOrder,
  IFormOrderConfirmation,
  IFiltered,
} from "./types";
import Form from "./components/Form";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { IMenuAction } from "./components/MenuAction/types";
import CancelConfirmation from "./components/CancelConfirmation";

function Orders() {
  const dispatch = useAppDispatch();
  const { tableHeaders, initialFiltered, initialNotification } = miscData();
  const [showNotify, setShowNotify] = useState<INotifyOrder>(initialNotification);
  const [showForm, setShowForm] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [action, setAction] = useState(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [filtered, setFiltered] = useState<IFiltered>(initialFiltered);

  const [tableOrders, setTableOrders] = useState<ITableOrder>({
    message: "",
    data: [],
    status: "idle",
  });

  const [formOrder, setFormOrder] = useState<IFormOrderState>({
    message: "",
    data: null,
    status: "idle",
    type: "create",
    id: "",
  });
  const [formOrderConfirmation, setFormOrderConfirmation] = useState<IFormOrderConfirmation>({
    status: "idle",
    message: "",
    openConfirmation: false,
    id: "",
  });

  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotify = ({ open, message, title, color }: INotifyOrder) => {
    setShowNotify({ open, message, title, color });
  };
  const closeNotify = () => {
    setShowNotify((prevState) => ({ ...prevState, open: false }));
    setFormOrder((prevState) => ({ ...prevState, status: "idle" }));
    setFormOrderConfirmation((prevState) => ({ ...prevState, status: "idle" }));
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
    setToggleFilter((prevState) => !prevState);
  };

  const fetchOrderList = async ({ status, createdAt, lastModified }: IFiltered) => {
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

  const handleCreate = () => {
    onShowForm();
    setFormOrder((prev) => ({ ...prev, type: "create", status: "idle", id: "" }));
  };

  const onShowCancelConfirmation = (transId: string) => {
    setFormOrderConfirmation((prev) => ({ ...prev, openConfirmation: true, id: transId }));
  };

  const onCloseCancelConfirmation = () => {
    setFormOrderConfirmation((prev) => ({
      ...prev,
      openConfirmation: false,
    }));
  };

  const onCancelOrderYes = async (transId: string) => {
    setFormOrderConfirmation((prev) => ({ ...prev, message: "", status: "loading" }));
    try {
      const { data } = await ordersServices.cancelOrder(transId);
      setFormOrderConfirmation((prev) => ({ ...prev, message: data.message, status: "succeeded" }));
      onCloseForm();
      onCloseCancelConfirmation();
    } catch (err: any) {
      setFormOrderConfirmation((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  const onSave = async (orderData: IOrderData, actions: FormikHelpers<IOrderData>) => {
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

  const onShowEdit = async (transId: string, type: IFormOrderState["type"]) => {
    onShowForm();
    setFormOrder((prev) => ({ ...prev, type, message: "", data: null, status: "loading" }));
    try {
      const { data } = await ordersServices.getOrderById(transId);
      setFormOrder((prev) => ({ ...prev, data: data.data, status: "succeeded", id: transId }));
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  // Refresh order list after create and update
  useEffect(() => {
    const { status, type } = formOrder;
    const { status: confirmationStatus, openConfirmation } = formOrderConfirmation;
    if (
      ((type === "create" || type === "update") && status === "succeeded") ||
      (!openConfirmation && confirmationStatus === "succeeded")
    )
      fetchOrderList(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOrder, formOrderConfirmation]);

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
      status: confirmationStatus,
      id: confirmationTransid,
      openConfirmation,
    } = formOrderConfirmation;
    const {
      status: orderStatus,
      id: orderTransid,
      message: orderMessage,
      type: orderType,
    } = formOrder;

    if (!showForm && !openConfirmation && confirmationStatus === "succeeded") {
      openNotify({
        open: true,
        message: `Transaction No. ${confirmationTransid}`,
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
  }, [showForm, formOrderConfirmation, formOrder]);

  const menuItemsAction: IMenuAction["items"] = [
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
        openConfirmation={formOrderConfirmation.openConfirmation}
        transId={formOrderConfirmation.id}
        isLoading={formOrderConfirmation.status === "loading"}
        OnCancelYes={onCancelOrderYes}
        OnCancelNo={onCloseCancelConfirmation}
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
                  <MDButton variant="outlined" onClick={handleCreate} sx={{ marginRight: "20px" }}>
                    Create new
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
                      display: "flex",
                      alignItems: "end",
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
                    />

                    <MDBox margin="8px">
                      <MDatePicker
                        label="Created at"
                        onChange={onCreatedAt}
                        inputVariant="outlined"
                        dateFormat="MM/dd/yyyy"
                        minTime={new Date()}
                        selected={filtered.createdAt}
                        inputStyle={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
                      />
                    </MDBox>

                    <MDBox margin="8px">
                      <MDatePicker
                        label="Last modified"
                        onChange={onLastModified}
                        inputVariant="outlined"
                        dateFormat="MM/dd/yyyy"
                        selected={filtered.lastModified}
                        inputStyle={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
                      />
                    </MDBox>

                    <MDButton
                      sx={{ margin: "8px" }}
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={onFilter}
                    >
                      Filter
                    </MDButton>
                    <MDButton
                      sx={{ margin: "8px" }}
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
