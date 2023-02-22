import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { FormikHelpers } from "formik";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import MDateRangePicker from "atoms/MDateRangePicker";
import MDButton from "atoms/MDButton";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useDownloadFile, useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import MDImageIcon from "atoms/MDImageIcon";
import excel from "assets/images/icons/excel.png";
import { inventoryServices, ordersServices } from "services";
import { AxiosError } from "axios";
import miscData from "./data";
import selector from "./selector";
import { INotifyDownload, IGroupBy, IOrderData, IFormOrderState, ITableOrder } from "./types";
import Form from "./components/Form";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { IMenuAction } from "./components/MenuAction/types";

function Orders() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, groupByData } = miscData();
  const initialStateNotification: INotifyDownload = {
    open: false,
    message: "",
    title: "",
    color: "primary",
  };
  const [showNotifyDownload, setShowNotifyDownload] =
    useState<INotifyDownload>(initialStateNotification);
  const [selectedGroupBy, setSelectedGroupBy] = useState<IGroupBy>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [, setDateRange] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [action, setAction] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(false);

  const [error, setError] = useState<AxiosError | null>(null);
  const [tableOrders, setTableOrders] = useState<ITableOrder>({
    message: "",
    data: [],
    status: "idle",
  });

  const [formOrder, setFormOrder] = useState<IFormOrderState>({
    message: "",
    data: null,
    status: "idle",
    type: "add",
  });

  const {
    downloadFile,
    status: downloadStatus,
    error: downloadError,
    filename,
  } = useDownloadFile();
  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotifyDownload = ({ open, message, title, color }: INotifyDownload) => {
    setShowNotifyDownload({ open, message, title, color });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload((prevState) => ({ ...prevState, open: false }));
  };

  const onShowForm = () => {
    setShowForm(true);
  };

  const onCloseForm = () => {
    setShowForm(false);
  };

  const onChangeGroupBy = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedGroupBy(e.target.value as IGroupBy);
  };

  const onChangeWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedWarehouse(e.target.value);
  };

  const onChangeDateRange = (dates) => {
    setDateRange(dates);
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const fetchOrderList = async () => {
    setTableOrders((prev) => ({ ...prev, status: "loading" }));

    try {
      const { data: rows } = await ordersServices.getOrderList();
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

  const exportFile = (format: "xlsx" | "csv") => {
    const data = { customer_code: customerCode, warehouse: selectedWarehouse, format };

    const fileName = `${customerCode}-${selectedWarehouse}.${format}`;
    downloadFile({
      url: "/inventory/export-excel",
      filename: fileName,
      data,
    });
    closeAction();
  };

  const onRefresh = () => {
    fetchOrderList();
    closeAction();
  };

  const onFilter = () => {
    fetchOrderList();
  };

  const onClear = () => {
    setSelectedWarehouse("");
    setSelectedGroupBy("");
  };

  const handleCreate = () => {
    onShowForm();
    setFormOrder((prev) => ({ ...prev, type: "add", status: "idle" }));
  };

  // TODO: add function for save Create and Update
  const onSave = async (orderData: IOrderData, actions: FormikHelpers<IOrderData>) => {
    setFormOrder((prev) => ({ ...prev, message: "", data: null, status: "loading" }));
    try {
      const { data } = await ordersServices.createOrder(orderData);
      setFormOrder((prev) => ({ ...prev, message: data.message, status: "succeeded" }));
      actions.resetForm();
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  const onShowEdit = async (transId: string) => {
    onShowForm();
    setFormOrder((prev) => ({ ...prev, type: "edit", message: "", data: null, status: "loading" }));
    try {
      const { data } = await ordersServices.getOrderById(transId);
      setFormOrder((prev) => ({ ...prev, data: data.data, status: "succeeded" }));
    } catch (err: any) {
      setFormOrder((prev) => ({ ...prev, message: err.message, status: "failed" }));
    }
  };

  useEffect(() => {
    fetchOrderList();
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const { message } = downloadError || {};
    let notificationMsg = initialStateNotification;

    if (!message && downloadStatus === "loading") {
      notificationMsg = {
        open: true,
        message: `Please wait exporting file [${filename}]`,
        title: "Exporting File",
        color: "info",
      };
    }
    if (!message && downloadStatus === "success") {
      notificationMsg = {
        open: true,
        message: `You can now open [${filename}]`,
        title: "Export file complete!",
        color: "success",
      };
    }
    if (message && downloadStatus === "failed") {
      notificationMsg = {
        open: true,
        message,
        title: "Failed to export file",
        color: "error",
      };
    }
    openNotifyDownload(notificationMsg);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadError, downloadStatus]);

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
    {
      icon: <MDImageIcon src={excel} alt="export-excel-icon" width={18} height={18} />,
      label: "Export as XLS file",
      onClick: () => exportFile("xlsx"),
    },
    {
      icon: (
        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
          description
        </Icon>
      ),
      label: "Export as CSV file",
      onClick: () => exportFile("csv"),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {tableOrders.status === "failed" && (
        <MDTypography variant="body2">{tableOrders.message}</MDTypography>
      )}

      <MDSnackbar
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        close={closeNotifyDownload}
      />

      <Form
        open={showForm}
        onClose={onCloseForm}
        onSave={onSave}
        data={formOrder}
        warehouseList={warehouseList}
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
                      label="Warehouse"
                      variant="outlined"
                      onChange={onChangeWarehouse}
                      options={warehouseList}
                      value={selectedWarehouse}
                      showArrowIcon
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                    />

                    <MDSelect
                      label="Group by"
                      variant="outlined"
                      onChange={onChangeGroupBy}
                      options={groupByData.stock}
                      value={selectedGroupBy}
                      showArrowIcon
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker label="Dates.." onChange={onChangeDateRange} />
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
                    columns: tableHeaders({ onShowEdit }),
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
