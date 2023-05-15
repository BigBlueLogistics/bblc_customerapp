import { useState, useEffect, ChangeEvent } from "react";
import { Grid, Card, Icon } from "@mui/material";
import { addMonths } from "date-fns";

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
import selector from "./selector";
import { INotifyOrder, IFormOrderState, ITableOrder, IFiltered } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import AutoCompleteMaterial from "./components/AutoCompleteMaterial";
import { IAutoCompleteMaterialData } from "./components/AutoCompleteMaterial/types";
import { IMenuAction } from "./components/MenuAction/types";

function Movements() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, initialFiltered, initialNotification, movementType } = miscData();
  const [showNotify, setShowNotify] = useState<INotifyOrder>(initialNotification);
  const [showForm] = useState(false);

  const [warehouseList, setWarehouseList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
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

  const onMovementType = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, type: e.target.value }));
  };

  const onWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered((prev) => ({ ...prev, warehouse: e.target.value }));
  };

  const onMaterial = (value: IAutoCompleteMaterialData) => {
    const materialCode = value?.material || null;
    setFiltered((prev) => ({ ...prev, materialCode }));
  };

  const onCoverageDate = (date: [Date, Date]) => {
    setFiltered((prev) => ({ ...prev, coverageDate: date }));
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

  const fetchMaterialDescription = async (code: string, warehouse: string) => {
    try {
      const { data: resp } = await ordersServices.getMaterialDescription({
        params: { customerCode: code, warehouseNo: warehouse },
      });
      if (resp) {
        setMaterialList(resp.data);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const warehouseNo = filtered.warehouse;
    if (customerCode && warehouseNo) {
      fetchMaterialDescription(customerCode, warehouseNo);
    }
  }, [customerCode, filtered.warehouse]);

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
                      label="Warehouse"
                      variant="outlined"
                      onChange={onWarehouse}
                      options={warehouseList}
                      value={filtered.warehouse}
                      showArrowIcon
                      itemStyle={{
                        textTransform: "uppercase",
                      }}
                      sx={({ palette }) => ({
                        "& .MuiInputBase-root": {
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        },
                      })}
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                    />

                    <MDSelect
                      label="Movement Type"
                      variant="outlined"
                      onChange={onMovementType}
                      options={movementType}
                      value={filtered.type}
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
                      options={materialList}
                      value={filtered.materialCode}
                      onChange={onMaterial}
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker
                        label="Coverage Date"
                        onChange={onCoverageDate}
                        buttonStyle={({ palette }) => ({
                          backgroundColor: `${palette.searchFilter.input.main} !important`,
                        })}
                        maxDate={addMonths(
                          filtered.coverageDate[0],
                          3
                        )} /* up to 3 months can select */
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
