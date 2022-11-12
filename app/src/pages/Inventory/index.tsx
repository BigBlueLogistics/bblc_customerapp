/* eslint-disable @typescript-eslint/no-unused-vars */
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
import selector from "./selector";
import { INotifyDownload } from "./types";
import MenuAction from "./components/MenuAction";
import { IMenuAction } from "./components/MenuAction/types";

function Inventory() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, groupOpts } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] = useState<INotifyDownload>({
    open: false,
    message: "",
    title: "",
    color: "primary",
  });
  const [selectedGroupBy, setSelectedGroupBy] = useState("material");
  const [selectedFilterBy, setSelectedFilterBy] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [rowsInventory, setRowsInventory] = useState([]);
  const [action, setAction] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const {
    downloadFile,
    status: downloadStatus,
    error: downloadError,
    filename,
  } = useDownloadFile();
  const openAction = ({ currentTarget }) => setAction(currentTarget);
  const closeAction = () => setAction(null);

  const openNotifyDownload = ({ message, title, color }: Omit<INotifyDownload, "open">) => {
    setShowNotifyDownload({ open: true, message, title, color });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload({ open: false });
  };

  const onChangeGroupBy = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedGroupBy(e.target.value);
  };

  const onChangeFilterBy = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFilterBy(e.target.value);
  };

  const fetchInventoryTable = async () => {
    setLoading(true);

    try {
      const tableBody = {
        customer_code: customerCode,
        warehouse: selectedFilterBy,
        group_by: selectedGroupBy,
      };

      const { data: rows } = await inventoryServices.getInventoryList({ params: tableBody });
      setRowsInventory(rows.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseList = async () => {
    setLoading(true);

    try {
      const { data: rows } = await inventoryServices.getWarehouseList();

      setWarehouseList(rows.data);
      if (rows.data.length) {
        setSelectedFilterBy(rows.data[0].PLANT);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = (format: "xlsx" | "csv") => {
    const data = { customer_code: customerCode, warehouse: selectedFilterBy, format };

    const fileName = `${customerCode}-${selectedFilterBy}.${format}`;
    downloadFile({
      url: "/inventory/export-excel",
      filename: fileName,
      data,
    });
    closeAction();
  };

  const refresh = () => {
    fetchInventoryTable();
    closeAction();
  };

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (customerCode && selectedFilterBy) {
      fetchInventoryTable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerCode, selectedFilterBy]);

  useEffect(() => {
    if (error?.response?.statusText === "Unauthorized" && error?.response?.status === 401) {
      dispatch(setIsAuthenticated(false));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const { message } = downloadError || {};

    if (!message && downloadStatus === "loading") {
      openNotifyDownload({
        message: `Please wait exporting file [${filename}]`,
        title: "Exporting File",
        color: "info",
      });
    }
    if (!message && downloadStatus === "success") {
      openNotifyDownload({
        message: `You can now open [${filename}]`,
        title: "Export file complete!",
        color: "success",
      });
    }
    if (message && downloadStatus === "failed") {
      openNotifyDownload({
        message,
        title: "Failed to export file",
        color: "error",
      });
    }
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
      onClick: refresh,
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

      {isLoading && <MDTypography variant="body2">Loading...</MDTypography>}
      {error && <MDTypography variant="body2">{error.message}</MDTypography>}

      <MDSnackbar
        color={showNotifyDownload.color}
        icon="info"
        title={showNotifyDownload.title}
        content={showNotifyDownload.message}
        dateTime="now"
        open={showNotifyDownload.open}
        close={closeNotifyDownload}
      />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={1}
                px={1}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox display="flex">
                  {/* <MDSelect
                    helperText="Group by"
                    onChange={onChangeGroupBy}
                    options={groupOpts}
                    value={selectedGroupBy}
                    showArrowIcon
                  /> */}

                  <MDSelect
                    helperText="Filter by Warehouse"
                    onChange={onChangeFilterBy}
                    options={warehouseList}
                    value={selectedFilterBy}
                    showArrowIcon
                    optKeyValue="PLANT"
                    optKeyLabel="NAME1"
                  />

                  <MDBox my="auto" marginLeft="auto">
                    <Icon
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                      fontSize="small"
                      onClick={openAction}
                    >
                      more_vert
                    </Icon>
                  </MDBox>
                  <MenuAction anchorEl={action} onClose={closeAction} items={menuItemsAction} />
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <MDTypography ml={3} variant="h4" color="dark" textTransform="uppercase">
                  Material Details
                </MDTypography>
                <DataTable
                  table={{ columns: tableHeaders, rows: rowsInventory }}
                  isSorted={false}
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
