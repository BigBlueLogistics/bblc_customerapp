import { useState, useEffect, ChangeEvent } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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
import miscData from "pages/Reports/data";
import { inventoryServices } from "services";
import { AxiosError } from "axios";
import { IStatus } from "types/status";
import selector from "./selector";
import { INotifyDownload } from "./types";
import MenuAction from "./components/MenuAction";
import ActionIcon from "./components/ActionIcon";
import { IMenuAction } from "./components/MenuAction/types";

function Reports() {
  const dispatch = useAppDispatch();
  const { customerCode } = selector();
  const { tableHeaders, reportOpts, groupOpts, sortOpts } = miscData();
  const [showNotifyDownload, setShowNotifyDownload] = useState<INotifyDownload>({
    open: false,
    message: "",
    title: "",
    color: "primary",
  });
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedGroupBy, setSelectedGroupBy] = useState("");
  const [selectedWH, setSelectedWH] = useState("");
  const [, setDateRange] = useState(null);
  const [selectedSort, setSelectedSort] = useState("");
  const [warehouseList, setWarehouseList] = useState([]);
  const [rowsInventory, setRowsInventory] = useState([]);
  const [action, setAction] = useState(null);
  const [toggleFilter, setToggleFilter] = useState(false);

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

  const openNotifyDownload = ({ message, title, color }: Omit<INotifyDownload, "open">) => {
    setShowNotifyDownload({ open: true, message, title, color });
  };
  const closeNotifyDownload = () => {
    setShowNotifyDownload({ open: false });
  };

  const onChangeReport = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedReport(e.target.value);
  };

  const onChangeGroupBy = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedGroupBy(e.target.value);
  };

  const onChangeWH = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedWH(e.target.value);
  };

  const onChangeDateRange = (dates) => {
    setDateRange(dates);
  };

  const onChangeSort = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSort(e.target.value);
  };

  const onToggleFilter = () => {
    setToggleFilter((prevState) => !prevState);
  };

  const fetchInventoryTable = async () => {
    setTableStatus("loading");

    try {
      const tableBody = {
        customer_code: customerCode,
        warehouse: selectedWH,
        group_by: selectedGroupBy,
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

      setWarehouseList([{ PLANT: "", NAME1: "--None--" }, ...rows.data]);
    } catch (err) {
      setError(err);
    }
  };

  const exportFile = (format: "xlsx" | "csv") => {
    const data = { customer_code: customerCode, warehouse: selectedWH, format };

    const fileName = `${customerCode}-${selectedWH}.${format}`;
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

  // useEffect(() => {
  //   if (customerCode && selectedWH) {
  //     fetchInventoryTable();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [customerCode, selectedWH]);

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

      {tableStatus === "failed" && <MDTypography variant="body2">{error.message}</MDTypography>}

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
                  Report Details
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
                      justifyContent: "center",
                      [breakpoints.down("md")]: {
                        justifyContent: "space-between",
                      },
                    })}
                  >
                    <MDSelect
                      label="Type of Reports"
                      variant="outlined"
                      onChange={onChangeReport}
                      options={reportOpts}
                      value={selectedReport}
                      showArrowIcon
                    />

                    <MDSelect
                      label="Group by"
                      variant="outlined"
                      onChange={onChangeGroupBy}
                      options={groupOpts}
                      value={selectedGroupBy}
                      showArrowIcon
                    />

                    <MDSelect
                      label="Warehouse"
                      variant="outlined"
                      onChange={onChangeWH}
                      options={warehouseList}
                      value={selectedWH}
                      showArrowIcon
                      optKeyValue="PLANT"
                      optKeyLabel="NAME1"
                    />

                    <MDSelect
                      label="Sort"
                      variant="outlined"
                      onChange={onChangeSort}
                      options={sortOpts}
                      value={selectedSort}
                      showArrowIcon
                    />

                    <MDBox margin="8px">
                      <MDateRangePicker label="Dates.." onChange={onChangeDateRange} />
                    </MDBox>

                    <MDButton sx={{ margin: "8px" }} size="small" variant="gradient" color="info">
                      Filter
                    </MDButton>
                    <MDButton
                      sx={{ margin: "8px" }}
                      size="small"
                      variant="gradient"
                      color="warning"
                    >
                      clear
                    </MDButton>
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

export default Reports;
