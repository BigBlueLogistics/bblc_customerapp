import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import MDSelect from "atoms/MDSelect";
import MDSnackbar from "atoms/MDSnackbar";
import Icon from "@mui/material/Icon";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import DashboardNavbar from "organisms/Navbars/DashboardNavbar";
import Footer from "organisms/Footer";
import DataTable from "organisms/Tables/DataTable";
import { useDownloadFile, useAppDispatch } from "hooks";
import { setIsAuthenticated } from "redux/auth/action";

import MDButton from "atoms/MDButton";
import MDImageIcon from "atoms/MDImageIcon";
import excel from "assets/images/icons/excel.png";
import miscData from "pages/Inventory/data";
import { inventoryServices } from "services";
import { AxiosError } from "axios";
import selector from "./selector";
import { INotifyDownload, TInventory } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { TMenuAction } from "./components/MenuAction/types";

function Inventory() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, initialStateNotification, initialInventory, initialFilter } = miscData();

  const [showNotifyDownload, setShowNotifyDownload] =
    useState<INotifyDownload>(initialStateNotification);
  const [warehouseList, setWarehouseList] = useState([]);
  const [action, setAction] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(true);

  const [tableInventory, setTableInventory] = useState<TInventory>(initialInventory);
  const [filtered, setFiltered] = useState(initialFilter);
  const [error, setError] = useState<AxiosError | null>(null);

  const {
    downloadFile,
    status: downloadStatus,
    error: downloadError,
    filename,
  } = useDownloadFile();
  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotifyDownload = ({
    key,
    open,
    message,
    title,
    color,
    autoHideDuration,
  }: INotifyDownload) => {
    setShowNotifyDownload({ key, open, message, title, color, autoHideDuration });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload((prevState) => ({ ...prevState, open: false }));
  };

  const fetchInventoryTable = async (warehouse: string, customer: string) => {
    setTableInventory((prev) => ({ ...prev, status: "loading" }));

    try {
      const tableBody = {
        customer_code: customer,
        warehouse,
      };

      const { data: rows } = await inventoryServices.getInventoryList({ params: tableBody });
      setTableInventory({
        status: "succeeded",
        data: rows.data,
        message: rows.message,
      });
    } catch (err) {
      setTableInventory({ status: "failed", message: err.message, data: [] });
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList([{ PLANT: "ALL", NAME1: "ALL WAREHOUSE" }, ...rows.data]);
    } catch (err) {
      setError(err);
    }
  };

  const exportFile = (format: "xlsx" | "csv") => {
    const { warehouse } = filtered;
    const data = { customer_code: customerCode, warehouse, format };

    const fileName = `INVENTORY-${customerCode}-${warehouse}.${format}`;
    downloadFile({
      url: "/inventory/export-excel",
      filename: fileName,
      data,
    });
    closeAction();
  };

  const onChangeWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setFiltered({ warehouse: e.target.value });
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const onRefresh = () => {
    fetchInventoryTable(filtered.warehouse, customerCode);
    closeAction();
  };

  const onFilter = () => {
    fetchInventoryTable(filtered.warehouse, customerCode);
  };

  const onClear = () => {
    setFiltered(initialFilter);

    setTableInventory(initialInventory);
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (customerCode) {
      // Clear filtering
      setFiltered(initialFilter);
      setTableInventory(initialInventory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerCode]);

  useEffect(() => {
    const { message } = downloadError || {};
    let notificationMsg = initialStateNotification;

    if (!message && downloadStatus === "loading") {
      notificationMsg = {
        key: 1,
        open: true,
        message: `Please wait exporting file [${filename}]`,
        title: "Exporting File",
        color: "info",
        autoHideDuration: null,
      };
    }
    if (!message && downloadStatus === "success") {
      notificationMsg = {
        key: 2,
        open: true,
        message: `You can now open [${filename}]`,
        title: "Export file complete!",
        color: "success",
        autoHideDuration: 5000,
      };
    }
    if (message && downloadStatus === "failed") {
      notificationMsg = {
        key: 3,
        open: true,
        message,
        title: "Failed to export file",
        color: "error",
        autoHideDuration: 5000,
      };
    }
    openNotifyDownload(notificationMsg);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadError, downloadStatus]);

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

      {tableInventory.status === "failed" && (
        <MDTypography variant="body2">{tableInventory.message}</MDTypography>
      )}

      <MDSnackbar
        key={showNotifyDownload.key}
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        autoHideDuration={showNotifyDownload.autoHideDuration}
        close={closeNotifyDownload}
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
              >
                <MDTypography ml={3} variant="h4" color="light" textTransform="uppercase">
                  Material Details
                </MDTypography>

                <MDBox my="auto" marginLeft="auto">
                  <ActionIcon
                    title={toggleFilter ? "close filter" : "open filter"}
                    onClick={onToggleFilter}
                  >
                    {toggleFilter ? "search_off" : "search"}
                  </ActionIcon>
                  <ActionIcon onClick={openAction}>more_vert</ActionIcon>
                </MDBox>
                <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
              </MDBox>

              <MDBox pt={3}>
                <MDBox
                  sx={({ palette: { grey } }) => ({
                    display: toggleFilter ? "block" : "none",
                    backgroundColor: grey[200],
                    borderTop: `2px solid ${grey[400]}`,
                    width: "100%",
                  })}
                >
                  <MDBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "10px",
                    }}
                  >
                    <MDSelect
                      label="Warehouse"
                      variant="outlined"
                      onChange={onChangeWarehouse}
                      options={warehouseList}
                      value={filtered.warehouse}
                      showArrowIcon
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                      sx={{ marginRight: "12px" }}
                    />

                    <MDButton
                      disabled={tableInventory.status === "loading"}
                      sx={{ marginRight: "12px" }}
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={onFilter}
                    >
                      Filter
                    </MDButton>
                    <MDButton
                      disabled={tableInventory.status === "loading"}
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
                  table={{ columns: tableHeaders, rows: tableInventory.data }}
                  isSorted={false}
                  isLoading={tableInventory.status === "loading"}
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

export default Inventory;
