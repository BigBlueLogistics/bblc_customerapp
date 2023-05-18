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

import MDImageIcon from "atoms/MDImageIcon";
import excel from "assets/images/icons/excel.png";
import miscData from "pages/Inventory/data";
import { inventoryServices } from "services";
import { AxiosError } from "axios";
import { IStatus } from "types/status";
import selector from "./selector";
import { INotifyDownload } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { IMenuAction } from "./components/MenuAction/types";

function Inventory() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, initialStateNotification } = miscData();

  const [showNotifyDownload, setShowNotifyDownload] =
    useState<INotifyDownload>(initialStateNotification);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [rowsInventory, setRowsInventory] = useState([]);
  const [action, setAction] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(true);

  const [tableStatus, setTableStatus] = useState<IStatus>("idle");
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

  const fetchInventoryTable = async (warehouse: string) => {
    setTableStatus("loading");

    try {
      const tableBody = {
        customer_code: customerCode,
        warehouse,
      };

      const { data: rows } = await inventoryServices.getInventoryList({ params: tableBody });
      setRowsInventory(rows.data);
      setTableStatus("succeeded");
    } catch (err) {
      setError(err);
      setTableStatus("failed");
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

    const fileName = `INVENTORY-${customerCode}-${selectedWarehouse}.${format}`;
    downloadFile({
      url: "/inventory/export-excel",
      filename: fileName,
      data,
    });
    closeAction();
  };

  const onChangeWarehouse = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedWarehouse(e.target.value);
    fetchInventoryTable(e.target.value);
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const onRefresh = () => {
    fetchInventoryTable(selectedWarehouse);
    closeAction();
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

      {tableStatus === "failed" && <MDTypography variant="body2">{error.message}</MDTypography>}

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
                      alignItems: "end",
                      justifyContent: "start",
                      padding: "10px",
                    }}
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
                  </MDBox>
                </MDBox>
                <DataTable
                  table={{ columns: tableHeaders, rows: rowsInventory }}
                  isSorted={false}
                  isLoading={tableStatus === "loading"}
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
