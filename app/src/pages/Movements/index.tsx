/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ChangeEvent } from "react";
import { Grid, Card, Icon } from "@mui/material";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import MDateRangePicker from "atoms/MDateRangePicker";
import MDButton from "atoms/MDButton";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import { inventoryServices, ordersServices } from "services";
import { AxiosError } from "axios";
import miscData from "./data";
import { INotifyOrder, IFormOrderState, ITableOrder, IFiltered } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import AutoCompleteMaterial from "./components/AutoCompleteMaterial";
import { IMenuAction } from "./components/MenuAction/types";

function Movements() {
  const dispatch = useAppDispatch();
  const { tableHeaders, initialFiltered, initialNotification, movementType } = miscData();
  const [showNotify, setShowNotify] = useState<INotifyOrder>(initialNotification);
  const [showForm] = useState(false);

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
    openConfirmation: false,
  });

  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotify = ({ open, message, title, color }: INotifyOrder) => {
    setShowNotify({ open, message, title, color });
  };
  const closeNotify = () => {
    setShowNotify((prevState) => ({ ...prevState, open: false }));
    setFormOrder({
      message: "",
      data: null,
      status: "idle",
      type: "create",
      id: "",
      openConfirmation: false,
    });
  };

  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, status: e.target.value }));
  };

  const onCoveredDate = (date: [Date, Date]) => {
    console.log("selected Date", date);
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
                  Movements Details
                </MDTypography>

                <MDBox my="auto" marginLeft="auto">
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
                  sx={({ palette: { grey, searchFilter } }) => ({
                    display: toggleFilter ? "block" : "none",
                    backgroundColor: searchFilter.container.default,
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
                      label="Movement Type"
                      variant="outlined"
                      onChange={onChangeStatus}
                      options={movementType}
                      value="inbound"
                      showArrowIcon
                      itemStyle={{
                        textTransform: "uppercase",
                      }}
                      sx={({ palette }) => ({
                        "& .MuiInputBase-root": {
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        },
                      })}
                    />

                    <AutoCompleteMaterial
                      options={[]}
                      value=""
                      onChange={(value) => console.log("material", value)}
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker
                        label="Covered Date"
                        onChange={onCoveredDate}
                        buttonStyle={({ palette }) => ({
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        })}
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
                    columns: tableHeaders(),
                    rows: [],
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

export default Movements;
